import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Switch } from 'antd';
import {DragOutlined} from '@ant-design/icons';
import {
  Footer,
  Item,
  ItemTitle,
  DragBtn,
} from './styled';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

interface ColumnsType {
  dataIndex: string;
  title: string;
  order: number;
  visible: boolean;
}

interface Props {
  dataSource: ColumnsType[];
  defaultColumns: ColumnsType[];
  visible: boolean;
  orderModalCancel: () => void;
  updateColumns: (rows: ColumnsType[]) => void;
}

const OrderModal: React.FC<Props> = (props) => {
  const [columns, setColumns] = useState<ColumnsType[]>([]);

  useEffect(() => {
    setColumns(
      props.dataSource.map((item) => {
        return { ...item };
      })
    );
  }, [props.dataSource]);

  const sortedColumns = useCallback(() => {
    return columns.sort((a, b) => (a.order > b.order ? 1 : -1));
  }, [columns]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) {
        return;
      }
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }
      const updateColumns = columns.map((e) => {
        return { ...e };
      });
      const [reorderItem] = updateColumns.splice(source.index, 1);
      updateColumns.splice(destination.index, 0, reorderItem);
      updateColumns.forEach((item, index) => {
        item.order = index;
      });
      setColumns(updateColumns);
    },
    [columns]
  );

  const updateVisibility = useCallback(
    (checkState: boolean, checkItem: ColumnsType) => {
      const updateRows = columns.map((item) => {
        if (item === checkItem) item = { ...checkItem, visible: checkState };
        return item;
      });
      setColumns(updateRows);
    },
    [columns]
  );

  const handleDefault = useCallback(() => {
    const updateColumns = columns.map((e) => {
      const defaultItem = props.defaultColumns.find(
        (def) => e.dataIndex === def.dataIndex
      );
      return {
        ...e,
        order: defaultItem!.order,
        visible: defaultItem!.visible,
      };
    });
    setColumns(updateColumns);
  }, [columns, props.defaultColumns]);

  const handleCancel = useCallback(() => {
    setColumns(props.dataSource);
    props.orderModalCancel();
  }, [props]);

  const handleOk = useCallback(() => {
    props.orderModalCancel();
    props.updateColumns(columns);
  }, [columns, props]);

  return (
    <Modal
      title="Customize Columns"
      visible={props.visible}
      onCancel={handleCancel}
      footer={
        <Footer>
          <div>
            <Button type="dashed" onClick={handleDefault}>Default settings</Button>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              Save
            </Button>
          </div>
        </Footer>
      }
    >
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Droppable droppableId="droppable" direction={'vertical'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sortedColumns().map((item, index) => (
                <Draggable
                  key={item.dataIndex}
                  draggableId={item.dataIndex}
                  index={index}
                >
                  {(provided) => (
                    <Item ref={provided.innerRef} {...provided.draggableProps}>
                      <DragBtn {...provided.dragHandleProps}>
                        <DragOutlined />
                      </DragBtn>
                      <ItemTitle>{item.title}</ItemTitle>
                      <Switch
                        key={item.dataIndex}
                        onChange={(e) => {
                          updateVisibility(e, item);
                        }}
                        checked={item.visible}
                      />
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Modal>
  );
};

export { OrderModal };
