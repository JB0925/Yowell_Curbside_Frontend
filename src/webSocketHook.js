import { useState, useEffect } from "react";

// define a custom hook
// accept the url to connect to,
// state: list of student names
// state setter: set the list of student names
// number of times the hook should retry a connection
// the interval between retries
function useWebSocketLite({
  socketUrl,
  curbsideData,
  setCurbsideData,
  setUsedNumbers,
  retry: defaultRetry = 3,
  retryInterval = 1500,
}) {
  // message and timestamp
  const [data, setData] = useState();
  // send function
  const [send, setSend] = useState(() => () => undefined);
  // state of our connection
  const [retry, setRetry] = useState(defaultRetry);
  // retry counter
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      console.log("Connected to socket");
      setReadyState(true);

      // function to send messages
      setSend(() => {
        return (data) => {
          try {
            const d = JSON.stringify(data);
            ws.send(d);
            return true;
          } catch (err) {
            return false;
          }
        };
      });

      setTimeoutOnConnection(ws);

      const getNumFromStudent = (msg) => {
        if (!msg) return;
        const pattern = /\d+/g;
        return msg.match(pattern);
      };

      // receive messages
      ws.onmessage = (event) => {
        if (event.data === "__ping__") {
          ws.send("__pong__");
          return;
        }
        const { state, newStudent } = formatMessage(event.data);
        console.log(`Frontend Websocket handler: newStudent = ${newStudent}`);
        if (newStudent === undefined) return;

        if (!getNumFromStudent(newStudent)) {
          if (state === "add" && newStudent) {
            setCurbsideData((curbsideData) => [...curbsideData, newStudent]);
            return;
          } else {
            setCurbsideData((curbsideData) => [
              ...curbsideData.filter((name) => name !== newStudent),
            ]);
            return;
          }
        }

        if (newStudent !== "Student not found" && newStudent !== undefined) {
          let num = getNumFromStudent(newStudent);
          setUsedNumbers((usedNumbers) => usedNumbers.concat(num));
          if (state === "add") {
            setCurbsideData((curbsideData) => {
              console.log(`curbsideData = ${curbsideData}`);
              console.log(`newStudent = ${newStudent}`);
              return [...curbsideData, newStudent];
            });
          } else {
            setCurbsideData((curbsideData) => [
              ...curbsideData.filter((name) => {
                console.log(`name = ${name}, newStudent = ${newStudent}`);
                return name !== newStudent;
              }),
            ]);
          }
        }
      };
    };

    // on close we should update connection state
    // and retry connection
    ws.onclose = () => {
      setReadyState(false);
      console.log("closing....");
      // retry logic
      if (retry > 0) {
        setTimeout(() => {
          setRetry((retry) => retry - 1);
        }, retryInterval);
      }
    };
    // terminate connection on unmount
    return () => {
      ws.close();
    };
    // retry dependency here triggers the connection attempt
  }, [retry, setCurbsideData, setUsedNumbers, socketUrl, retryInterval]);

  return { send, data, readyState };
}

// small utilities that we need
// handle json messages
const formatMessage = (data) => {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    return data;
  }
};

// There should be no reason that a connection should be open for more than 1 hour
// However, a user may not explicity close the connection, so we should close it
const setTimeoutOnConnection = (ws) => {
  setTimeout(() => {
    try {
      ws.close(1000, "Closing due to inactivity");
    } catch (err) {
      console.log(err);
    }
  }, 3_600_000);
};

export default useWebSocketLite;
