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
import { useState, useRef, useEffect } from 'react';
import { useTimer } from '../contexts/TimerContext';
import './Tasks.css';
var Tasks = function () {
    var _a = useTimer(), tasks = _a.tasks, addTask = _a.addTask, updateTask = _a.updateTask, deleteTask = _a.deleteTask, completeTask = _a.completeTask, deleteAllTasks = _a.deleteAllTasks, deleteCompletedTasks = _a.deleteCompletedTasks, deleteIncompleteTasks = _a.deleteIncompleteTasks, markAllTasksComplete = _a.markAllTasksComplete, markAllTasksIncomplete = _a.markAllTasksIncomplete;
    var _b = useState(false), showModal = _b[0], setShowModal = _b[1];
    var _c = useState(false), showDropdown = _c[0], setShowDropdown = _c[1];
    var _d = useState(''), taskName = _d[0], setTaskName = _d[1];
    var _e = useState(1), estimatedPomodoros = _e[0], setEstimatedPomodoros = _e[1];
    var _f = useState(false), isImportant = _f[0], setIsImportant = _f[1];
    var dropdownRef = useRef(null);
    var handleAddTask = function () {
        if (taskName.trim()) {
            addTask({
                name: taskName.trim(),
                estimatedPomodoros: estimatedPomodoros,
                isImportant: isImportant,
            });
            setTaskName('');
            setEstimatedPomodoros(1);
            setIsImportant(false);
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
    // Fechar dropdown quando clicar fora
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    var handleDropdownToggle = function () {
        setShowDropdown(!showDropdown);
    };
    var handleDeleteAllTasks = function () {
        if (window.confirm('Tem certeza que deseja deletar todas as tarefas?')) {
            deleteAllTasks();
        }
        setShowDropdown(false);
    };
    var handleDeleteCompletedTasks = function () {
        if (window.confirm('Tem certeza que deseja deletar todas as tarefas concluídas?')) {
            deleteCompletedTasks();
        }
        setShowDropdown(false);
    };
    var handleDeleteIncompleteTasks = function () {
        if (window.confirm('Tem certeza que deseja deletar todas as tarefas não concluídas?')) {
            deleteIncompleteTasks();
        }
        setShowDropdown(false);
    };
    var handleMarkAllComplete = function () {
        markAllTasksComplete();
        setShowDropdown(false);
    };
    var handleMarkAllIncomplete = function () {
        markAllTasksIncomplete();
        setShowDropdown(false);
    };
    return (_jsxs("div", __assign({ className: "tasks-section" }, { children: [_jsxs("div", __assign({ className: "tasks-header" }, { children: [_jsx("h3", { children: "Tarefas" }), _jsxs("div", __assign({ className: "tasks-options-container", ref: dropdownRef }, { children: [_jsx("button", __assign({ className: "tasks-options", onClick: handleDropdownToggle }, { children: _jsx("i", { className: "fas fa-ellipsis-v" }) })), showDropdown && (_jsxs("div", __assign({ className: "tasks-dropdown" }, { children: [_jsxs("button", __assign({ className: "dropdown-item", onClick: handleDeleteAllTasks }, { children: [_jsx("i", { className: "fas fa-trash" }), "Deletar todas as tarefas"] })), _jsxs("button", __assign({ className: "dropdown-item", onClick: handleDeleteCompletedTasks }, { children: [_jsx("i", { className: "fas fa-check-circle" }), "Deletar tarefas conclu\u00EDdas"] })), _jsxs("button", __assign({ className: "dropdown-item", onClick: handleDeleteIncompleteTasks }, { children: [_jsx("i", { className: "fas fa-circle" }), "Deletar tarefas n\u00E3o conclu\u00EDdas"] })), _jsxs("button", __assign({ className: "dropdown-item", onClick: handleMarkAllComplete }, { children: [_jsx("i", { className: "fas fa-check-double" }), "Marcar todas como conclu\u00EDdas"] })), _jsxs("button", __assign({ className: "dropdown-item", onClick: handleMarkAllIncomplete }, { children: [_jsx("i", { className: "fas fa-undo" }), "Desmarcar todas as conclu\u00EDdas"] }))] })))] }))] })), _jsx("div", __assign({ className: "add-task" }, { children: _jsxs("button", __assign({ className: "add-task-btn", onClick: function () { return setShowModal(true); } }, { children: [_jsx("i", { className: "fas fa-plus" }), _jsx("span", { children: "Adicionar Tarefa" })] })) })), _jsx("div", __assign({ className: "tasks-list" }, { children: tasks.length === 0 ? (_jsx("div", __assign({ className: "empty-tasks" }, { children: _jsx("p", { children: "Nenhuma tarefa adicionada ainda" }) }))) : (tasks.map(function (task) { return (_jsxs("div", __assign({ className: "task-item ".concat(task.isCompleted ? 'completed' : '') }, { children: [_jsxs("div", __assign({ className: "task-content" }, { children: [_jsx("button", __assign({ className: "task-checkbox", onClick: function () { return handleCompleteTask(task.id); } }, { children: _jsx("i", { className: "fas ".concat(task.isCompleted ? 'fa-check' : 'fa-circle') }) })), _jsxs("div", __assign({ className: "task-info" }, { children: [_jsxs("div", __assign({ className: "task-name-container" }, { children: [_jsx("span", __assign({ className: "task-name" }, { children: task.name })), task.isImportant && (_jsx("span", __assign({ className: "importance-indicator", title: "Tarefa importante" }, { children: _jsx("i", { className: "fas fa-exclamation-triangle" }) })))] })), _jsxs("span", __assign({ className: "task-pomodoros" }, { children: [task.completedPomodoros, "/", task.estimatedPomodoros, " pomodoros"] }))] }))] })), _jsx("button", __assign({ className: "task-delete", onClick: function () { return handleDeleteTask(task.id); } }, { children: _jsx("i", { className: "fas fa-trash" }) }))] }), task.id)); })) })), showModal && (_jsx("div", __assign({ className: "modal-overlay", onClick: function () { return setShowModal(false); } }, { children: _jsxs("div", __assign({ className: "modal", onClick: function (e) { return e.stopPropagation(); } }, { children: [_jsxs("div", __assign({ className: "modal-header" }, { children: [_jsx("h3", { children: "Adicionar Nova Tarefa" }), _jsx("button", __assign({ className: "close-btn", onClick: function () { return setShowModal(false); } }, { children: _jsx("i", { className: "fas fa-times" }) }))] })), _jsxs("div", __assign({ className: "modal-body" }, { children: [_jsx("input", { type: "text", placeholder: "Nome da tarefa", value: taskName, onChange: function (e) { return setTaskName(e.target.value); }, onKeyPress: handleKeyPress, autoFocus: true }), _jsxs("div", __assign({ className: "pomodoro-estimate" }, { children: [_jsx("label", __assign({ htmlFor: "pomodoroEstimate" }, { children: "Estimativa de Pomodoros:" })), _jsx("input", { type: "number", id: "pomodoroEstimate", min: "1", max: "10", value: estimatedPomodoros, onChange: function (e) { return setEstimatedPomodoros(parseInt(e.target.value) || 1); } })] })), _jsx("div", __assign({ className: "importance-checkbox" }, { children: _jsxs("label", __assign({ className: "checkbox-label" }, { children: [_jsx("input", { type: "checkbox", checked: isImportant, onChange: function (e) { return setIsImportant(e.target.checked); } }), _jsx("span", { className: "checkmark" }), _jsx("span", __assign({ className: "checkbox-text" }, { children: "Marcar como importante" }))] })) }))] })), _jsxs("div", __assign({ className: "modal-footer" }, { children: [_jsx("button", __assign({ className: "btn btn-secondary", onClick: function () { return setShowModal(false); } }, { children: "Cancelar" })), _jsx("button", __assign({ className: "btn btn-primary", onClick: handleAddTask, disabled: !taskName.trim() }, { children: "Salvar" }))] }))] })) })))] })));
};
export default Tasks;
