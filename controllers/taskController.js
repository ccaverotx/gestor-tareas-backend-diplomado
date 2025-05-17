const { Task } = require('../models');
const { Op } = require('sequelize');

// Crear una tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const newTask = await Task.create({
      title,
      description,
      status: 'pendiente',
      dueDate,
      userId: req.userId
    });

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
};

// Obtener todas las tareas del usuario, con filtro y búsqueda
exports.getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filters = { userId: req.userId };

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.title = { [Op.iLike]: `%${search}%` };
    }

    const tasks = await Task.findAll({ where: filters });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
};

// Obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea', error: error.message });
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const { title, description, status, dueDate } = req.body;

    if (task.status === 'completada') {
      return res.status(400).json({ message: 'No se puede modificar una tarea completada' });
    }

    if (status === 'pendiente' && task.status !== 'pendiente') {
      return res.status(400).json({ message: 'No se puede volver a pendiente' });
    }

    if (status === 'completada' && task.status !== 'en progreso') {
      return res.status(400).json({ message: 'Solo se puede marcar como completada si está en progreso' });
    }

    await task.update({ title, description, status, dueDate });
    res.json({ message: 'Tarea actualizada', task });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (task.status !== 'completada') {
      return res.status(400).json({ message: 'Solo se puede eliminar una tarea completada' });
    }

    await task.destroy();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
};
