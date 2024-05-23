import { useRef } from "react";

import Input from "./Input";
import Modal from "./Modal";

export default function NewProject({ onAdd, onCancel }) {
  const modal = useRef();

  const title = useRef();
  const description = useRef();
  const dueDate = useRef();

// React 组件中的 handleSave 函数
function handleSave() {
  const enteredTitle = title.current.value;
  const enteredDescription = description.current.value;
  const enteredDueDate = dueDate.current.value;

  if (
    enteredTitle.trim() === "" ||
    enteredDescription.trim() === "" ||
    enteredDueDate.trim() === ""
  ) {
    modal.current.open();
    return;
  }

  
  fetch('http://localhost:3000/api/projectPost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: enteredTitle,
      description: enteredDescription,
      dueDate: enteredDueDate,
    }),
  })
  .then(response => {
    if (response.ok) {
      // 如果保存成功，可以做一些处理，比如重置表单
      title.current.value = '';
      description.current.value = '';
      dueDate.current.value = '';
      // 或者显示成功消息给用户
    } else {
      // 如果保存失败，可以显示错误消息给用户
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  window.location.reload();
}

  return (
    <>
      <Modal ref={modal} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
        <p className="text-stone-600 mb-4">
          Oops ... looks like you forgot to enter a value.
        </p>
        <p className="text-stone-600 mb-4">
          Please make sure you provide a valid value for every input field.
        </p>
      </Modal>
      <div style={{padding:"0 15rem 0 0"}} className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              className="text-stone-800 hover:text-stone-950"
              onClick={onCancel}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
              onClick={handleSave}
            >
              Save
            </button>
          </li>
        </menu>
        <div>
          <Input type="text" ref={title} label="Title" />
          <Input ref={description} label="Description" textarea />
          <Input type="date" ref={dueDate} label="Due Date" />
        </div>
      </div>
    </>
  );
}
