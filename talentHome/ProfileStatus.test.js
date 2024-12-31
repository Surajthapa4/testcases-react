import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import currentAgencyMemberReducer from "../path/to/currentAgencyMemberReducer";
import ProfileStatus from "./index"; 

const createMockStore = (preloadedState) =>
    configureStore({
      reducer: {
        currentAgencyMemberReducer, // Add other reducers if necessary
      },
      preloadedState,
    });
describe("ProfileStatus Component", () => {
  const mockFunctions = {
    setShowConditions: jest.fn(),
    setOpenModal: jest.fn(),
    setShowIncompleteSteps: jest.fn(),
    updateProfile: jest.fn(),
    statusMeter: jest.fn(),
    getUpcomingStatus: jest.fn(),
    getNeededActions: jest.fn(),
  };

  const mockProps = {
    profileStatus: "Incomplete",
    noOfStepsRequired: 3,
    conditions: [
      {
        title: "Condition 1",
        conditions: [
          { complete: true, title: "Sub-condition 1" },
          { complete: false, title: "Sub-condition 2" },
        ],
      },
    ],
    showFullProfileButton: true,
    showCondtions: false,
    currentInstrID: null,
  };

  const preloadedState = {
    currentAgencyMemberReducer: {
      // Add any mock state needed for your tests
    },
  };

  it("renders Profile Status section correctly", () => {
    const store = createMockStore(preloadedState);

    render(
      <Provider store={store}>
        <ProfileStatus
          {...mockProps}
          setShowConditions={mockFunctions.setShowConditions}
          setOpenModal={mockFunctions.setOpenModal}
          setShowIncompleteSteps={mockFunctions.setShowIncompleteSteps}
          updateProfile={mockFunctions.updateProfile}
          statusMeter={mockFunctions.statusMeter}
          getUpcomingStatus={mockFunctions.getUpcomingStatus}
          getNeededActions={mockFunctions.getNeededActions}
        />
      </Provider>
    );

    expect(screen.getByText("Profile Status:")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  it("handles mouse hover and click events on the info icon", () => {
    render(
      <ProfileStatus
        {...mockProps}
        setShowConditions={mockFunctions.setShowConditions}
        setOpenModal={mockFunctions.setOpenModal}
      />
    );

    const infoIcon = screen.getByAltText("");
    fireEvent.mouseEnter(infoIcon);
    expect(mockFunctions.setShowConditions).toHaveBeenCalledWith(true);

    fireEvent.mouseLeave(infoIcon);
    expect(mockFunctions.setShowConditions).toHaveBeenCalledWith(false);

    fireEvent.click(infoIcon);
    expect(mockFunctions.setOpenModal).toHaveBeenCalledWith(true);
  });

  it("displays steps to upgrade if profile is not 'Best'", () => {
    render(
      <ProfileStatus
        {...mockProps}
        getUpcomingStatus={mockFunctions.getUpcomingStatus}
      />
    );

    expect(screen.getByText("3 Step(s) to")).toBeInTheDocument();
  });

  it("renders condition cards correctly", () => {
    render(<ProfileStatus {...mockProps} />);

    expect(screen.getByText("Condition 1")).toBeInTheDocument();
    expect(screen.getByText("Sub-condition 1")).toBeInTheDocument();
    expect(screen.getByText("Sub-condition 2")).toBeInTheDocument();
  });

  it("displays the 'Edit Full Profile' button correctly", () => {
    render(
      <ProfileStatus
        {...mockProps}
        profileStatus="Incomplete"
        showFullProfileButton={true}
      />
    );

    const editButton = screen.getByText("Edit Full Profile");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockFunctions.updateProfile).toHaveBeenCalled();
  });

  it("renders the update profile button when profile is 'Best'", () => {
    render(
      <ProfileStatus
        {...mockProps}
        profileStatus="Best"
        showFullProfileButton={true}
      />
    );

    const updateButton = screen.getByText("Update Profile");
    expect(updateButton).toBeInTheDocument();

    fireEvent.click(updateButton);
    expect(mockFunctions.updateProfile).toHaveBeenCalled();
  });
});
