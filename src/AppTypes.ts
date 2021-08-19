export interface ColumnsType {
  dataIndex: string;
  title: string;
  order: number;
  visible: boolean;
}

export interface orderModalProps {
  dataSource: ColumnsType[];
  defaultColumns: ColumnsType[];
  visible: boolean;
  orderModalCancel: () => void;
  updateColumns: (rows: ColumnsType[]) => void;
}