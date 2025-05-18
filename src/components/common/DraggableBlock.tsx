'use client';

import { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

type BackendItem = { index: number; text: string };
type Props = { backendItems: BackendItem[] };

export default function DraggableBlock({ backendItems }: Props) {
  const [items, setItems] = useState<
    { id: string; text: string }[]
  >([]);

  useEffect(() => {
    if (backendItems?.length) {
      setItems(
        backendItems.map((obj) => ({
          /** stable unique id for DnD; never changes */
          id: `item-${obj.index}`,
          text: obj.text.trim(), // remove accidental spaces
        }))
      );
    }
  }, [backendItems]);

  /** Handle drop */
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
  };


  return (

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="textList">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {items.map((item, i) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={i}
                >
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className="mb-2 p-3 bg-gray-100 rounded shadow cursor-move"
                    >
                      {i + 1}. {item.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
  );
}
