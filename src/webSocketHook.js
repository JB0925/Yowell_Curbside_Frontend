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
      // console.log("Connected to socket");
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

      const getNumFromStudent = (msg) => {
        if (!msg) return;
        return msg.split(":")[0].replace("#", "");
      };

      // receive messages
      ws.onmessage = (event) => {
        const { state, newStudent } = formatMessage(event.data);
        if (newStudent !== "Student not found") {
          let num = getNumFromStudent(newStudent);
          setUsedNumbers((usedNumbers) => usedNumbers.concat(num));
          if (state === "add") {
            setCurbsideData((curbsideData) => [...curbsideData, newStudent]);
          } else {
            setCurbsideData((curbsideData) => [
              ...curbsideData.filter((name) => name !== newStudent),
            ]);
          }
        }
      };
    };

    // on close we should update connection state
    // and retry connection
    ws.onclose = () => {
      setReadyState(false);
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
  }, [retry]);

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

export default useWebSocketLite;
