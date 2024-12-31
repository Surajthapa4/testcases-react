import { render, screen, fireEvent } from '@testing-library/react';
import OpenBids from './OpenBids'; // Adjust to the actual component name
import '@testing-library/jest-dom/extend-expect';

// Mock data and functions
const mockOpenBidsData = [
  {
    projectId: '123',
    instrId: '456',
    startDate: '2024-12-31',
    projectTitle: 'Test Project 1',
    proposalPlacedDate: '2024-12-25'
  },
  {
    projectId: '124',
    instrId: '457',
    startDate: '2024-01-01',
    projectTitle: 'Test Project 2',
    proposalPlacedDate: '2024-12-26'
  }
];

const mockHistoryPush = jest.fn();
const mockToggleRows = jest.fn();
const mockConvertDate = jest.fn().mockReturnValue('December 25, 2024');
const mockFetchingData = false; // Set to true to test loading state

describe('UpcomingJobsMobileWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the header with label and View All link', () => {
    render(
      <OpenBids
        openBidsData={mockOpenBidsData}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const header = screen.getByText('Open Proposals');
    expect(header).toBeInTheDocument();

    const viewAllLink = screen.getByText('View All');
    expect(viewAllLink).toBeInTheDocument();
  });

  test('should show loading state when fetchingData is true', () => {
    render(
      <OpenBids
        openBidsData={mockOpenBidsData}
        fetchingData={true} // Set to true to simulate loading state
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const loadingText = screen.getByText('Getting Details... Please Wait');
    expect(loadingText).toBeInTheDocument();
  });

  test('should render job details for open bids', () => {
    render(
      <OpenBids
        openBidsData={mockOpenBidsData}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    // Check if the first project is rendered
    const jobTitle = screen.getByText('Job #123');
    expect(jobTitle).toBeInTheDocument();

    const startDate = screen.getByText('Start Date');
    expect(startDate).toBeInTheDocument();

    const proposalDate = screen.getByText('December 25, 2024');
    expect(proposalDate).toBeInTheDocument();
  });

  test('should call history.push when View All is clicked', () => {
    render(
      <OpenBids
        openBidsData={mockOpenBidsData}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const viewAllLink = screen.getByText('View All');
    fireEvent.click(viewAllLink);

    expect(mockHistoryPush).toHaveBeenCalledWith('/open-proposals');
  });

  test('should toggle row visibility when down arrow is clicked', () => {
    render(
      <OpenBids
        openBidsData={mockOpenBidsData}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const downArrow = screen.getAllByAltText('project')[0];
    fireEvent.click(downArrow);

    expect(mockToggleRows).toHaveBeenCalledWith('123'); // Checking if the projectId is passed
  });

  test('should display "No Open Proposals" when openBidsData is empty', () => {
    render(
      <OpenBids
        openBidsData={[]}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const noDataText = screen.getByText('No Open Proposals');
    expect(noDataText).toBeInTheDocument();
  });

  test('should render empty state if no open bids data and no fetching', () => {
    render(
      <OpenBids
        openBidsData={[]}
        fetchingData={mockFetchingData}
        history={{ push: mockHistoryPush }}
        toggleRows={mockToggleRows}
        convertDate={mockConvertDate}
      />
    );

    const emptyStateText = screen.getByText('We currently have no data to show here');
    expect(emptyStateText).toBeInTheDocument();
  });
});
