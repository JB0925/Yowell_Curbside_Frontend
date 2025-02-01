import { BLORPO, BLORPO_NAME_ONLY, HOME, QUIXLEY, QUIXLEY_NAME_ONLY, RESET_PAGE, SNORP_AND_QUIXLEY, TEST_PASSWORD, TEST_USERNAME, ZOGBERT, ZOGBERT_AND_BLORPO, ZOGBERT_BLORPO_QUIXLEY } from "./constants";
import { test, expect } from "@playwright/test";

test.beforeEach("Ensure Logged In", async ({ page }) => {
  await page.goto(HOME);
  await page.getByLabel("Username").fill(TEST_USERNAME);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  const submitButton = page.locator('.login').getByRole('button', { name: 'Submit' });
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  const label = page.locator('form label[for="curbsideNumber"]');
  await label.scrollIntoViewIfNeeded();
  await expect(label).toBeInViewport();
});

test.afterEach("Reset Data", async ({ page }) => {
  await page.goto(RESET_PAGE);
  await page.getByText("Reset").click();
  await page.goto(HOME);
});

test("loads the homepage", async ({ page }) => {
  await page.goto(HOME);
  await expect(page.locator("#header")).toHaveText("YES Curbside!");
});

test("add student - simple case", async ({ page }) => {
  await page.goto(HOME);
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1");
  const submitButton = page.locator('.StudentList').getByRole('button');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  await expect(page.locator("ul")).toHaveText(ZOGBERT);
});

test("add multiple students by number with + sign", async ({ page }) => {
  await page.goto(HOME);
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1+2");
  const submitButton = page.locator('.StudentList').getByRole('button');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  await expect(page.locator("ul")).toHaveText(ZOGBERT_AND_BLORPO);
});

test("add student by name", async ({ page }) => {
  // go to homepage
  await page.goto(HOME);

  // get the input for student names
  const studentNameInput = page.locator('input[placeholder="Enter name here"]');
  await studentNameInput.scrollIntoViewIfNeeded();
  await expect(studentNameInput).toBeVisible();

  // put a name into the input and click the autocomplete div that holds the name we want
  await studentNameInput.fill(QUIXLEY_NAME_ONLY);
  const autocompleteName = page.locator(".autocomplete-name").getByText("Quixley VonZoom");
  autocompleteName.scrollIntoViewIfNeeded();
  await expect(autocompleteName).toBeInViewport();
  await autocompleteName.click();

  // get the form submission button and submit it
  const submitButton = page.locator('.StudentList').getByRole('button');
  await expect(submitButton).toHaveCount(1, { timeout: 5000 });
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await submitButton.click({ force: true });

  // we should expect the following to now be in the DOM
  await expect(page.locator("ul")).toHaveText(QUIXLEY);
});

test("add student by name and number at the same time", async ({ page }) => {
  // go to homepage
  await page.goto(HOME);

  // get the input for numbers and put a number in it
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("4");

  // get the input for student names
  const studentNameInput = page.locator('input[placeholder="Enter name here"]');
  await studentNameInput.scrollIntoViewIfNeeded();
  await expect(studentNameInput).toBeVisible();

  // put a name into the input and click the autocomplete div that holds the name we want
  await studentNameInput.fill(QUIXLEY_NAME_ONLY);
  const autocompleteName = page.locator(".autocomplete-name").getByText("Quixley VonZoom");
  autocompleteName.scrollIntoViewIfNeeded();
  await expect(autocompleteName).toBeInViewport();
  await autocompleteName.click();

  // get the form submission button and submit it
  const submitButton = page.locator('.StudentList').getByRole('button');
  await expect(submitButton).toHaveCount(1, { timeout: 5000 });
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await submitButton.click({ force: true });

  // we should expect the following to now be in the DOM
  await expect(page.locator("ul")).toHaveText(SNORP_AND_QUIXLEY);
});

test("add student by name and multiple numbers at the same time", async ({ page }) => {
  // go to homepage
  await page.goto(HOME);

  // get the input for numbers and put a number in it
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1+2");

  // get the input for student names
  const studentNameInput = page.locator('input[placeholder="Enter name here"]');
  await studentNameInput.scrollIntoViewIfNeeded();
  await expect(studentNameInput).toBeVisible();

  // put a name into the input and click the autocomplete div that holds the name we want
  await studentNameInput.fill(QUIXLEY_NAME_ONLY);
  const autocompleteName = page.locator(".autocomplete-name").getByText("Quixley VonZoom");
  autocompleteName.scrollIntoViewIfNeeded();
  await expect(autocompleteName).toBeInViewport();
  await autocompleteName.click();

  // get the form submission button and submit it
  const submitButton = page.locator('.StudentList').getByRole('button');
  await expect(submitButton).toHaveCount(1, { timeout: 5000 });
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await submitButton.click({ force: true });

  // we should expect the following to now be in the DOM
  await expect(page.locator("ul")).toHaveText(ZOGBERT_BLORPO_QUIXLEY);
});

test("add and remove student", async ({ page }) => {
  await page.goto(HOME);

  // select the input and the button and add the student
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1");
  const submitButton = page.locator('.StudentList').getByRole('button');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  // student should now be in the DOM
  await expect(page.locator("ul")).toHaveText(ZOGBERT);

  // remove the student
  const removeBtn = page.locator("#remove");
  await submitButton.scrollIntoViewIfNeeded();
  await removeBtn.click({ force: true });

  // student should no longer be in the DOM
  await expect(page.locator("ul")).not.toHaveText(ZOGBERT);
});

test("once removed, can't be added again", async ({ page }) => {
  await page.goto(HOME);

  // Add the student
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1");
  const submitButton = page.locator('.StudentList').getByRole('button');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  // expect them to be in the DOM
  await expect(page.locator("ul")).toHaveText(ZOGBERT);

  // remove the student
  const removeBtn = page.locator("#remove");
  await removeBtn.scrollIntoViewIfNeeded();
  await removeBtn.click({ force: true });

  // expect that they are removed from the DOM
  await expect(page.locator("ul")).not.toHaveText(ZOGBERT);

  // try to add again and make sure it was NOT successful
  await curbsideInput.fill("7");
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });
  await expect(page.locator("ul")).not.toHaveText(ZOGBERT);
});

test("Adding a student with no number works", async ({ page }) => {
  await page.goto(HOME);

  // select the input and add the student with no number
  const noNumberContainer = page.locator("#header");
  await noNumberContainer.scrollIntoViewIfNeeded();
  await noNumberContainer.click();

  const noNumberInput = page.locator('input[placeholder="Enter student name"]').nth(0);
  await noNumberInput.scrollIntoViewIfNeeded();
  await expect(noNumberInput).toBeInViewport();
  await noNumberInput.fill("foobar");
  
  const noNumberButton = page.locator(".StudentNoNumber").getByRole("button");
  await noNumberButton.scrollIntoViewIfNeeded();
  await noNumberButton.click({ force: true });

  // expect to see their name in the DOM
  await expect(page.getByText("foobar", { exact: false })).toBeVisible();
});

test("Removing a student with no number works", async ({ page }) => {
  await page.goto(HOME);

  // select the input and add the student with no number
  const noNumberContainer = page.locator("#header");
  await noNumberContainer.scrollIntoViewIfNeeded();
  await noNumberContainer.click();

  const noNumberInput = page.locator('input[placeholder="Enter student name"]').nth(0);
  await noNumberInput.scrollIntoViewIfNeeded();
  await expect(noNumberInput).toBeInViewport();
  await noNumberInput.fill("foobar");
  
  const noNumberButton = page.locator(".StudentNoNumber").getByRole("button");
  await noNumberButton.scrollIntoViewIfNeeded();
  await noNumberButton.click({ force: true });

  // expect that their name is in the DOM
  await expect(page.getByText("foobar", { exact: false })).toBeVisible();

  // remove them and expect that they are no longer in the DOM
  const removeBtn = page.locator("#remove");
  await removeBtn.scrollIntoViewIfNeeded();
  await removeBtn.click({ force: true });

  await expect(page.locator("ul")).not.toHaveText("foobar");
});

test("The <ul> toggler is functional", async ({ page }) => {
  await page.goto(HOME);
  const toggler = page.locator("#showUl");
  const ul = page.locator("ul");
  await toggler.scrollIntoViewIfNeeded();
  await toggler.click({ force: true });

  await expect(ul).not.toBeVisible();
  await expect(ul).toHaveClass("show");

  await toggler.click({ force: true });

  await expect(ul).toHaveClass("");
});

test("The burger menu button opens and closes the sidebar", async ({ page }) => {
  await page.goto(HOME);
  const burgerButton = page.locator("#burgerMenu");
  const sidebar = page.locator(".sidebar-container");
  await burgerButton.scrollIntoViewIfNeeded();
  await sidebar.scrollIntoViewIfNeeded();

  await expect(sidebar).toHaveClass("sidebar-container");

  await burgerButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container open");

  const closeButton = page.locator("#closeBtn");
  await closeButton.scrollIntoViewIfNeeded();
  await closeButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container");
});

test("The sidebar links work", async ({ page }) => {
  await page.goto(HOME);
  const burgerButton = page.locator("#burgerMenu");
  const sidebar = page.locator(".sidebar-container");
  await burgerButton.scrollIntoViewIfNeeded();
  await sidebar.scrollIntoViewIfNeeded();

  await expect(sidebar).toHaveClass("sidebar-container");

  await burgerButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container open");

  const homeLink = page.locator('a').filter({ hasText: 'Home' });
  const studentListLink = page.locator('a').filter({ hasText: 'Student List' });
  await homeLink.scrollIntoViewIfNeeded();
  await studentListLink.scrollIntoViewIfNeeded();
  await studentListLink.click({ force: true });
  expect(page.url()).toBe("http://localhost:3000/studentList");

  await burgerButton.scrollIntoViewIfNeeded();
  await burgerButton.click({ force: true });
  await expect(sidebar).toHaveClass("sidebar-container open");

  await homeLink.scrollIntoViewIfNeeded();
  await homeLink.click({ force: true });
  expect(page.url()).toBe("http://localhost:3000/");
});

test("The studentList page loads and works", async ({ page }) => {
  await page.goto(HOME);
  const burgerButton = page.locator("#burgerMenu");
  const sidebar = page.locator(".sidebar-container");
  await burgerButton.scrollIntoViewIfNeeded();
  await sidebar.scrollIntoViewIfNeeded();

  await expect(sidebar).toHaveClass("sidebar-container");

  await burgerButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container open");

  const studentListLink = page.locator('a').filter({ hasText: 'Student List' });
  await studentListLink.scrollIntoViewIfNeeded();
  await studentListLink.click({ force: true });
  expect(page.url()).toBe("http://localhost:3000/studentList");

  await expect(page.getByText("Next number should be:", { exact: false })).toBeVisible();

  const studentSearchInput = page.locator('input[placeholder="Enter a student name"]');
  const searchSubmitBtn = page.locator("#searchBtn");
  await studentSearchInput.scrollIntoViewIfNeeded();
  await expect(studentSearchInput).toBeVisible();

  await studentSearchInput.fill(BLORPO_NAME_ONLY);
  await searchSubmitBtn.scrollIntoViewIfNeeded();
  await expect(searchSubmitBtn).toBeVisible();
  searchSubmitBtn.dispatchEvent("click");

  await expect(page.locator("#message")).toContainText("2 Blorpo McFizz");
});

test("trying to add a group of students with a student that was removed fails", async ({ page }) => {
  await page.goto(HOME);

  // add the student
  await page.waitForLoadState('networkidle'); 
  const curbsideInput = page.locator('input#curbsideNumber');
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1");
  const submitButton = page.locator('.StudentList').getByRole('button');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });

  // student should be in the DOM
  await expect(page.locator("ul")).toHaveText(ZOGBERT);

  // remove the student
  const removeBtn = page.locator("#remove");
  await removeBtn.scrollIntoViewIfNeeded();
  await removeBtn.click({ force: true });

  // student should no longer be in the DOM
  await expect(page.locator("ul")).not.toHaveText(ZOGBERT);

  await curbsideInput.fill("1");
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });
  await expect(page.locator("ul")).not.toHaveText(ZOGBERT);

  // try to add the original student with another student
  await curbsideInput.scrollIntoViewIfNeeded();
  await expect(curbsideInput).toBeInViewport();
  await curbsideInput.fill("1+2");

  // it should not work - neither should be there
  await submitButton.scrollIntoViewIfNeeded();
  await expect(submitButton).toBeInViewport();
  await submitButton.click({ force: true });
  await expect(page.locator("ul")).not.toHaveText(BLORPO);
});

test("adding a new student works", async ({ page }) => {
  await page.goto(HOME);
  const burgerButton = page.locator("#burgerMenu");
  const sidebar = page.locator(".sidebar-container");
  await burgerButton.scrollIntoViewIfNeeded();
  await sidebar.scrollIntoViewIfNeeded();

  await expect(sidebar).toHaveClass("sidebar-container");

  await burgerButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container open");

  const numberInput = page.locator("input#number");
  const nameInput = page.locator("input#name");
  await numberInput.scrollIntoViewIfNeeded();
  await numberInput.fill("6");
  await nameInput.scrollIntoViewIfNeeded();
  await nameInput.fill("Joe Schmoe");

  const submitBtn = page.locator("button.studentNumber").nth(1);
  await submitBtn.scrollIntoViewIfNeeded();
  await expect(submitBtn).toBeVisible();

  await submitBtn.click({ force: true });

  await expect(page.getByText("Student added successfully!")).toBeVisible();
});

test("changing an existing student's name works", async ({ page }) => {
  await page.goto(HOME);
  const burgerButton = page.locator("#burgerMenu");
  const sidebar = page.locator(".sidebar-container");
  await burgerButton.scrollIntoViewIfNeeded();
  await sidebar.scrollIntoViewIfNeeded();

  await expect(sidebar).toHaveClass("sidebar-container");

  await burgerButton.click({ force: true });

  await expect(sidebar).toHaveClass("sidebar-container open");

  await page.selectOption("select#addStudentSelect", "2");
  const numberInput = page.locator("input#number");
  const nameInput = page.locator("input#name");
  await numberInput.scrollIntoViewIfNeeded();
  await numberInput.fill("6");
  await nameInput.scrollIntoViewIfNeeded();
  await nameInput.fill("Joe Thomas");

  const submitBtn = page.locator("button.studentNumber").nth(1);
  await submitBtn.scrollIntoViewIfNeeded();
  await expect(submitBtn).toBeVisible();

  await submitBtn.click({ force: true });

  await expect(page.getByText("Student updated successfully!")).toBeVisible();
});