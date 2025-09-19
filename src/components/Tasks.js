var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTimer } from '../contexts/TimerContext';
import './Tasks.css';
var Tasks = function () {
    var _a = useTimer(), tasks = _a.tasks, addTask = _a.addTask, updateTask = _a.updateTask, deleteTask = _a.deleteTask, completeTask = _a.completeTask;
    var _b = useState(false), showModal = _b[0], setShowModal = _b[1];
    var _c = useState(''), taskName = _c[0], setTaskName = _c[1];
    var _d = useState(1), estimatedPomodoros = _d[0], setEstimatedPomodoros = _d[1];
    var handleAddTask = function () {
        if (taskName.trim()) {
            addTask({
                name: taskName.trim(),
                estimatedPomodoros: estimatedPomodoros,
            });
            setTaskName('');
            setEstimatedPomodoros(1);
            setShowModal(false);
        }
    };
    var handleCompleteTask = function (taskId) {
        completeTask(taskId);
    };
    var handleDeleteTask = function (taskId) {
        deleteTask(taskId);
    };
    var handleKeyPress = function (e) {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };
    return (_jsxs("div", __assign({ className: "tasks-section" }, { children: [_jsxs("div", __assign({ className: "tasks-header" }, { children: [_jsx("h3", { children: "Tarefas" }), _jsx("button", __assign({ className: "tasks-options" }, { children: _jsx("i", { className: "fas fa-ellipsis-v" }) }))] })), _jsx("div", __assign({ className: "add-task" }, { children: _jsxs("button", __assign({ className: "add-task-btn", onClick: function () { return setShowModal(true); } }, { children: [_jsx("i", { className: "fas fa-plus" }), _jsx("span", { children: "Adicionar Tarefa" })] })) })), _jsx("div", __assign({ className: "tasks-list" }, { children: tasks.length === 0 ? (_jsx("div", __assign({ className: "empty-tasks" }, { children: _jsx("p", { children: "Nenhuma tarefa adicionada ainda" }) }))) : (tasks.map(function (task) { return (_jsxs("div", __assign({ className: "task-item ".concat(task.isCompleted ? 'completed' : '') }, { children: [_jsxs("div", __assign({ className: "task-content" }, { children: [_jsx("button", __assign({ className: "task-checkbox", onClick: function () { return handleCompleteTask(task.id); } }, { children: _jsx("i", { className: "fas ".concat(task.isCompleted ? 'fa-check' : 'fa-circle') }) })), _jsxs("div", __assign({ className: "task-info" }, { children: [_jsx("span", __assign({ className: "task-name" }, { children: task.name })), _jsxs("span", __assign({ className: "task-pomodoros" }, { children: [task.completedPomodoros, "/", task.estimatedPomodoros, " pomodoros"] }))] }))] })), _jsx("button", __assign({ className: "task-delete", onClick: function () { return handleDeleteTask(task.id); } }, { children: _jsx("i", { className: "fas fa-trash" }) }))] }), task.id)); })) })), showModal && (_jsx("div", __assign({ className: "modal-overlay", onClick: function () { return setShowModal(false); } }, { children: _jsxs("div", __assign({ className: "modal", onClick: function (e) { return e.stopPropagation(); } }, { children: [_jsxs("div", __assign({ className: "modal-header" }, { children: [_jsx("h3", { children: "Adicionar Nova Tarefa" }), _jsx("button", __assign({ className: "close-btn", onClick: function () { return setShowModal(false); } }, { children: _jsx("i", { className: "fas fa-times" }) }))] })), _jsxs("div", __assign({ className: "modal-body" }, { children: [_jsx("input", { type: "text", placeholder: "Nome da tarefa", value: taskName, onChange: function (e) { return setTaskName(e.target.value); }, onKeyPress: handleKeyPress, autoFocus: true }), _jsxs("div", __assign({ className: "pomodoro-estimate" }, { children: [_jsx("label", __assign({ htmlFor: "pomodoroEstimate" }, { children: "Estimativa de Pomodoros:" })), _jsx("input", { type: "number", id: "pomodoroEstimate", min: "1", max: "10", value: estimatedPomodoros, onChange: function (e) { return setEstimatedPomodoros(parseInt(e.target.value) || 1); } })] }))] })), _jsxs("div", __assign({ className: "modal-footer" }, { children: [_jsx("button", __assign({ className: "btn btn-secondary", onClick: function () { return setShowModal(false); } }, { children: "Cancelar" })), _jsx("button", __assign({ className: "btn btn-primary", onClick: handleAddTask, disabled: !taskName.trim() }, { children: "Salvar" }))] }))] })) })))] })));
};
export default Tasks;
