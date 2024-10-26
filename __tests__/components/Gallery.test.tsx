import { render, screen, fireEvent } from '@testing-library/react';
import Gallery from '@/components/Gallery';

const mockItems = [
  {
    id: 1,
    src: 'https://example.com/image1.jpg',
    alt: 'Test image 1',
    title: 'Test Title 1',
    date: '2024',
    description: 'Test description 1',
  },
  {
    id: 2,
    src: 'https://example.com/image2.jpg',
    alt: 'Test image 2',
    title: 'Test Title 2',
    date: '2024',
    description: 'Test description 2',
  },
];

describe('Gallery', () => {
  it('renders all gallery items', () => {
    render(<Gallery items={mockItems} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(mockItems.length);
  });

  it('filters items based on search', () => {
    render(<Gallery items={mockItems} />);
    const searchInput = screen.getByRole('searchbox');
    
    fireEvent.change(searchInput, { target: { value: 'Test Title 1' } });
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('shows no results message when search has no matches', () => {
    render(<Gallery items={mockItems} />);
    const searchInput = screen.getByRole('searchbox');
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText('No items found matching your search.')).toBeInTheDocument();
  });

  it('opens modal when clicking an item', () => {
    render(<Gallery items={mockItems} />);
    const firstItem = screen.getAllByRole('listitem')[0];
    
    fireEvent.click(firstItem);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});