import { render, screen, fireEvent } from '@testing-library/react';
import QuickStats from './QuickStats';  
import '@testing-library/jest-dom';

describe('QuickStats Component', () => {
  let mockHandleFilterClick;
  let mockSetSelectedFilterValue;

  beforeEach(() => {
    mockHandleFilterClick = jest.fn();
    mockSetSelectedFilterValue = jest.fn();

    render(
      <QuickStats
        selectedFilterValue="This Month"
        setSelectedFilterValue={mockSetSelectedFilterValue}
        handleFilterClick={mockHandleFilterClick}
        loader={false}
        quickStats={{
          upcomingJobs: 10,
          jobsInProgress: 5,
          thisMonthPaymentsReceived: 1000,
          allTimePaymentsReceived: 5000,
          thisMonthPaymentsPending: 200,
          allTimePaymentsPending: 1000,
        }}
        currency_formatter={(val) => `$${val}`}
      />
    );
  });

  it('should render the component correctly', () => {
    expect(screen.getByText(/Quick Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/This Month/i)).toBeInTheDocument();
    expect(screen.getByText(/All Time/i)).toBeInTheDocument();
  });

  it('should display the correct initial filter value', () => {
    const thisMonthButton = screen.getByText(/This Month/i);
    const allTimeButton = screen.getByText(/All Time/i);
    expect(thisMonthButton).toHaveClass('statsFilterItemActive');
    expect(allTimeButton).not.toHaveClass('statsFilterItemActive');
  });

  it('should change the filter when clicked', () => {
    const thisMonthButton = screen.getByText(/This Month/i);
    fireEvent.click(thisMonthButton);
    expect(mockHandleFilterClick).toHaveBeenCalledWith('This Month');

    const allTimeButton = screen.getByText(/All Time/i);
    fireEvent.click(allTimeButton);
    expect(mockHandleFilterClick).toHaveBeenCalledWith('All Time');
  });

  it('should display the correct stats data', () => {
    expect(screen.getByText('$1000')).toBeInTheDocument(); // Payments Received (This Month)
    expect(screen.getByText('$200')).toBeInTheDocument(); // Payments Pending (This Month)
    expect(screen.getByText('10')).toBeInTheDocument(); // Upcoming Tasks
    expect(screen.getByText('5')).toBeInTheDocument(); // Jobs in Progress
  });

  it('should format payments with currency', () => {
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  it('should render empty stats when loader is true', () => {
    render(
      <QuickStats
        selectedFilterValue="This Month"
        setSelectedFilterValue={mockSetSelectedFilterValue}
        handleFilterClick={mockHandleFilterClick}
        loader={true}
        quickStats={{
          upcomingJobs: 10,
          jobsInProgress: 5,
          thisMonthPaymentsReceived: 1000,
          allTimePaymentsReceived: 5000,
          thisMonthPaymentsPending: 200,
          allTimePaymentsPending: 1000,
        }}
        currency_formatter={(val) => `$${val}`}
      />
    );
    expect(screen.queryByText('$1000')).toBeNull(); // Should not display when loader is true
  });

  it('should update filter value on dropdown selection', () => {
    const dropdown = screen.getByTestId('rolesNameUserView'); // Adjust to your element's test id
    fireEvent.change(dropdown, { target: { value: 'All Time' } });
    expect(mockSetSelectedFilterValue).toHaveBeenCalledWith('All Time');
  });
});
