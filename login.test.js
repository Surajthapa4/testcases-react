import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Login from "./index.js";
import '@testing-library/jest-dom';
import * as loginService from "../../../services/login";
import * as localStorageUtil from "../../../util/localStorage";

const mockStore = configureStore([]);
jest.mock("../../../services/login");
jest.mock("../../../util/localStorage");

describe("Login Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

//   it("renders Login component correctly", () => {
//     renderComponent();
//     expect(screen.getByText(/Log In/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
//   });

//   it("displays validation error when required fields are empty", async () => {
//     renderComponent();
//     fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
//     await waitFor(() => {
//       expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
//       expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
//     });
//   });

//   it("calls login API on form submit and handles success response", async () => {
//     const loginApiMock = jest.spyOn(loginService, "loginApi").mockResolvedValue({
//       data: {
//         token: "fakeToken",
//         refreshToken: "fakeRefreshToken",
//         loginId: 1,
//         instrId: 2,
//         lastVisitedPage: "/dashboard",
//       },
//     });

//     const saveRememberMeMock = jest.spyOn(localStorageUtil, "saveRememberMe");

//     renderComponent();

//     fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: "test@example.com" } });
//     fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });
//     fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

//     await waitFor(() => {
//       expect(loginApiMock).toHaveBeenCalledWith({ email: "test@example.com", password: "password" });
//       expect(saveRememberMeMock).toHaveBeenCalledWith("test@example.com");
//       expect(store.getActions()).toContainEqual(expect.objectContaining({ type: "LOGIN_DATA_SET" }));
//     });
//   });

  it("displays error message on API failure", async () => {
    jest.spyOn(loginService, "loginApi").mockRejectedValue({
      response: { data: { error: "Invalid credentials" } },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Email Address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});