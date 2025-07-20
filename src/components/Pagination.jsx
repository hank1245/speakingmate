import styled from "styled-components";
import { colors } from "../styles/common";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  background: ${props => props.active ? colors.primary : colors.background.input};
  color: ${props => props.active ? colors.text.primary : colors.text.secondary};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 40px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? colors.primary : colors.background.hover};
    border-color: ${colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: ${colors.text.muted};
  font-size: 14px;
  margin: 0 16px;
`;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ←
      </PageButton>

      {getVisiblePages().map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} style={{ color: colors.text.muted }}>
            ...
          </span>
        ) : (
          <PageButton
            key={page}
            active={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        )
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        →
      </PageButton>

      <PageInfo>
        {startItem}-{endItem} of {totalItems}
      </PageInfo>
    </PaginationContainer>
  );
}

export default Pagination;