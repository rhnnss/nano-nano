export interface RenderCellProps {
  columnKey: React.Key;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}
