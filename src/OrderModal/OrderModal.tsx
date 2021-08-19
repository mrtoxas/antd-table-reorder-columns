import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Switch } from 'antd';
import { DragOutlined } from '@ant-design/icons';
import { ColumnsType, orderModalProps } from '../AppTypes';
import { Item, ItemTitle, DragBtn } from './styled';
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

const OrderModal: React.FC<orderModalProps> = (props) => {
  const [columns, setColumns] = useState<ColumnsType[]>([]);

  useEffect(() => {
    setColumns(props.dataSource.map((item) => ({ ...item })));
  }, [props.dataSource]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      const updateColumns = columns.map((col) => ({ ...col }));
      const [reorderItem] = updateColumns.splice(source.index, 1);
      updateColumns.splice(destination.index, 0, reorderItem);
      updateColumns.forEach((item, index) => item.order = index);
      setColumns(updateColumns);
    },
    [columns]
  );

  const updateVisibility = useCallback(
    (checkState: boolean, checkItem: ColumnsType) => {
      setColumns(() => (
        columns.map((item) => {
          if (item === checkItem) item = { ...checkItem, visible: checkState };
          return item;
        })
      ))
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

  const modalFooter = useMemo(() => {
    return (
      <footer>
        <div>
          <Button type="dashed" onClick={handleDefault}>Default settings</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={handleOk}>
            Save
          </Button>
        </div>
      </footer>
    )
  },[handleCancel, handleDefault, handleOk])

  const provided = useMemo(() => {
    const sortedColumns = columns.sort((a, b) => (a.order > b.order ? 1 : -1));

    return (
    (provided: DroppableProvided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {sortedColumns.map((item, index) => (
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
                  onChange={(e) => (updateVisibility(e, item))}
                  checked={item.visible}
                />
              </Item>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    ))
  },[columns, updateVisibility])


  return (
    <Modal
      title="Customize Columns"
      visible={props.visible}
      onCancel={handleCancel}
      footer={modalFooter}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction={'vertical'}>
          {provided}
        </Droppable>
      </DragDropContext>
    </Modal>
  );
};

export { OrderModal };
