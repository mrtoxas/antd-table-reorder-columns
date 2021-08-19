import React, { useState, useCallback, useMemo } from 'react';
import { OrderModal } from './OrderModal';
import { Table, Button } from 'antd';
import useLocalStorage from 'use-local-storage';
import { Header, Wrapper } from './styled';
import { ColumnsType } from './AppTypes';

const columnData = [
  {
    dataIndex: "column1",
    title: "Column1",
    visible: true,
    order: 0,
  },
  {
    dataIndex: "column2",
    title: "Column2",
    order: 1,
    visible: true
  },
  {
    dataIndex: "column3",
    title: "Column3",
    order: 2,
    visible: true
  },
  {
    dataIndex: "column4",
    title: "Column4",
    order: 3,
    visible: true
  },
  {
    dataIndex: "column5",
    title: "Column5",
    order: 4,
    visible: true
  },
  {
    dataIndex: "column6",
    title: "Column6",
    order: 5,
    visible: true
  }
];

const data = [
  {
    key: "0",
    column1: "Data Column1",
    column2: "Data Column2",
    column3: 'Data Column3',
    column4: "Data Column4",
    column5: "Data Column5",
    column6: "Data Column6"
  },
];

const App: React.FC = () => {
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

  const getOrderColumns = () => {
    const objCopy: ColumnsType[] = [];
    columnData.map((e) => {
      objCopy.push({
        dataIndex: e.dataIndex,
        title: e.title,
        order: e.order,
        visible: e.visible,
      });
    });
    return objCopy;
  };

  const [columns, setColumns] = useLocalStorage<ColumnsType[]>('doc_columns', getOrderColumns());

  const getColumns = useMemo(() => {
    return columnData
      .reduce((acc, curVal) => {
        const col = columns.find((e) => e.dataIndex === curVal.dataIndex);
        if (col!.visible) acc.splice(col!.order, 0, {...curVal, visible: col!.visible, order: col!.order});
        return acc;
      }, [] as ColumnsType[])
  }, [columns]);

  const orderModalChangeVisible = useCallback(() => {
    setIsOrderModalVisible(!isOrderModalVisible);
  },[isOrderModalVisible])

  const updateColumns = useCallback(
    (data: ColumnsType[]) => setColumns(data),
    [setColumns]
  );

  return (
    <div>
      <Header>
        <Button onClick={orderModalChangeVisible}>Customize Columns</Button>
      </Header>
      <Wrapper>
        <OrderModal
          orderModalCancel={orderModalChangeVisible}
          visible={isOrderModalVisible}
          dataSource={columns}
          defaultColumns={columnData}
          updateColumns={updateColumns}
        />
        <Table
          columns={getColumns}
          dataSource={data}
          pagination={false}
        />
      </Wrapper>
    </div>
  );
};

export default App;
