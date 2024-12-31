import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingJobs from './UpcomingJobs';
import { BrowserRouter as Router } from 'react-router-dom';

describe('UpcomingJobs Component', () => {
  // Mock data
  const mockOpenBidsData = [
    { projectId: '1', projectTitle: 'Project 1', proposalPlacedDate: '2024-12-31', instrId: '123' },
    { projectId: '2', projectTitle: 'Project 2', proposalPlacedDate: '2024-12-30', instrId: '124' },
  ];
  const mockUpcomingJobsData = [
    { jobID: '1', projectTitle: 'Job 1', firstName: 'John', lastName: 'Doe', location: 'Location 1', startDate: '2024-12-31', noofActionReq: 1 },
    { jobID: '2', projectTitle: 'Job 2', firstName: 'Jane', lastName: 'Doe', location: 'Location 2', startDate: '2024-12-30', noofActionReq: 0 },
  ];

  const mockToggleTabs = jest.fn();
  const mockHistoryPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Router>
        <UpcomingJobs 
          activeTab="UpcomingJobs" 
          openBidsData={mockOpenBidsData} 
          upcomingJobsData={mockUpcomingJobsData} 
          fetchingData={false}
          toggleTabs={mockToggleTabs}
          history={{ push: mockHistoryPush }}
          tableHeaders={['Job ID', 'Project Title', 'Instructor', 'Start Date']}
          tableHeaders2={['Project ID', 'Title', 'Date']}
          isAgency={true}
        />
      </Router>
    );
  });

  test('renders the Upcoming Jobs and Open Proposals tabs correctly', () => {
    // Check if both tabs are rendered
    const upcomingTab = screen.getByText(/Upcoming Tasks/i);
    const openBidsTab = screen.getByText(/Open Proposals/i);

    expect(upcomingTab).toBeInTheDocument();
    expect(openBidsTab).toBeInTheDocument();
  });

  test('should switch tabs when clicked', () => {
    // Click on "Open Proposals" tab
    const openBidsTab = screen.getByText(/Open Proposals/i);
    fireEvent.click(openBidsTab);

    // Check if the toggleTabs function was called
    expect(mockToggleTabs).toHaveBeenCalledWith('OpenBids');
  });

  test('displays correct open bids data', () => {
    // Check if open bids data is displayed correctly
    const projectId = screen.getByText(/1/i);
    const projectTitle = screen.getByText(/Project 1/i);
    const proposalDate = screen.getByText(/2024-12-31/i);

    expect(projectId).toBeInTheDocument();
    expect(projectTitle).toBeInTheDocument();
    expect(proposalDate).toBeInTheDocument();
  });

  test('displays correct upcoming jobs data', () => {
    // Switch to Upcoming Jobs tab
    const upcomingTab = screen.getByText(/Upcoming Tasks/i);
    fireEvent.click(upcomingTab);

    // Check if upcoming jobs data is displayed correctly
    const jobID = screen.getByText(/1/i);
    const jobTitle = screen.getByText(/Job 1/i);
    const instructorName = screen.getByText(/John Doe/i);
    const startDate = screen.getByText(/2024-12-31/i);

    expect(jobID).toBeInTheDocument();
    expect(jobTitle).toBeInTheDocument();
    expect(instructorName).toBeInTheDocument();
    expect(startDate).toBeInTheDocument();
  });

  test('shows empty state when no data is available', () => {
    // Update data to simulate no upcoming jobs
    render(
      <Router>
        <UpcomingJobs 
          activeTab="UpcomingJobs" 
          openBidsData={mockOpenBidsData} 
          upcomingJobsData={[]} 
          fetchingData={false}
          toggleTabs={mockToggleTabs}
          history={{ push: mockHistoryPush }}
          tableHeaders={['Job ID', 'Project Title', 'Instructor', 'Start Date']}
          tableHeaders2={['Project ID', 'Title', 'Date']}
          isAgency={true}
        />
      </Router>
    );

    const emptyState = screen.getByText(/No Upcoming Tasks/i);
    expect(emptyState).toBeInTheDocument();
  });

  test('should navigate to calendar view on "View All" click', () => {
    const viewAllButton = screen.getByText(/View All/i);
    fireEvent.click(viewAllButton);

    expect(mockHistoryPush).toHaveBeenCalledWith('/calendar-view?view=list');
  });

  test('should handle loading state correctly', () => {
    render(
      <Router>
        <UpcomingJobs 
          activeTab="UpcomingJobs" 
          openBidsData={mockOpenBidsData} 
          upcomingJobsData={mockUpcomingJobsData} 
          fetchingData={true}
          toggleTabs={mockToggleTabs}
          history={{ push: mockHistoryPush }}
          tableHeaders={['Job ID', 'Project Title', 'Instructor', 'Start Date']}
          tableHeaders2={['Project ID', 'Title', 'Date']}
          isAgency={true}
        />
      </Router>
    );

    const loadingText = screen.getByText(/Getting Details... Please Wait/i);
    expect(loadingText).toBeInTheDocument();
  });
});
