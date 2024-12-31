import { render, screen, fireEvent } from '@testing-library/react';
import MarketingCard from './MarketingCard'; // Assuming the component is named 'MarketingCard'
import { BrowserRouter as Router } from 'react-router-dom'; // Assuming React Router is used
import '@testing-library/jest-dom/extend-expect';

describe('MarketingCard Component', () => {
  const mockMarketingData = [
    { imageName: 'image1.jpg', heading: 'Campaign 1', content: 'Content 1', buttonText: 'Learn More', buttonUrl: '/learn-more' },
    { imageName: 'image2.jpg', heading: 'Campaign 2', content: 'Content 2', buttonText: 'Discover', buttonUrl: '/discover' },
  ];

  const mockRedirect = jest.fn();
  const mockMoveBackward = jest.fn();
  const mockMoveForward = jest.fn();
  const mockSetIndex = jest.fn();
  const generateUrl = jest.fn().mockReturnValue('https://example.com/image.jpg');
  const convertToHtml = jest.fn().mockReturnValue('<p>Converted HTML</p>');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the marketing card with correct content', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    // Check for the image
    const image = screen.getByAltText('');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');

    // Check for heading
    const heading = screen.getByText('Campaign 1');
    expect(heading).toBeInTheDocument();

    // Check for content
    const content = screen.getByText('Converted HTML');
    expect(content).toBeInTheDocument();

    // Check for button text
    const button = screen.getByText('Learn More');
    expect(button).toBeInTheDocument();
  });

  test('should call redirect when the button is clicked', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    const button = screen.getByText('Learn More');
    fireEvent.click(button);

    expect(mockRedirect).toHaveBeenCalledWith('/learn-more');
  });

  test('should render the navigation arrows and indicators when multiple marketing items are present', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    // Check if left arrow is rendered
    const leftArrow = screen.getByAltText('leftArrow');
    expect(leftArrow).toBeInTheDocument();
    
    // Check if right arrow is rendered
    const rightArrow = screen.getByAltText('rightArrow');
    expect(rightArrow).toBeInTheDocument();

    // Check if indicator box exists
    const indicatorBox = screen.getByClassName('indicator-box');
    expect(indicatorBox).toBeInTheDocument();

    // Check the number of indicators
    const indicators = screen.getAllByClassName('control-indicator');
    expect(indicators.length).toBe(mockMarketingData.length);
  });

  test('should call moveBackward when the left arrow is clicked', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    const leftArrow = screen.getByAltText('leftArrow');
    fireEvent.click(leftArrow);

    expect(mockMoveBackward).toHaveBeenCalled();
  });

  test('should call moveForward when the right arrow is clicked', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    const rightArrow = screen.getByAltText('rightArrow');
    fireEvent.click(rightArrow);

    expect(mockMoveForward).toHaveBeenCalled();
  });

  test('should call setIndex when an indicator is clicked', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={mockMarketingData}
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    const indicator = screen.getAllByClassName('control-indicator')[1];
    fireEvent.click(indicator);

    expect(mockSetIndex).toHaveBeenCalledWith(1);
  });

  test('should not render navigation arrows if there is only one marketing data item', () => {
    render(
      <Router>
        <MarketingCard
          className="test-class"
          marketingData={[mockMarketingData[0]]} // Only one item
          index={0}
          redirect={mockRedirect}
          moveBackward={mockMoveBackward}
          moveForward={mockMoveForward}
          setIndex={mockSetIndex}
          generateUrl={generateUrl}
          convertToHtml={convertToHtml}
        />
      </Router>
    );

    const leftArrow = screen.queryByAltText('leftArrow');
    const rightArrow = screen.queryByAltText('rightArrow');

    expect(leftArrow).toBeNull();
    expect(rightArrow).toBeNull();
  });
});
