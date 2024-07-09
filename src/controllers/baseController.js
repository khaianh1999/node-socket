class BaseController {
    constructor(model) {
      this.model = model;
    }
  
    create(req, res) {
      const data = req.body;
      this.model.create(data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ...data });
      });
    }
  
    findById(req, res) {
      const id = req.params.id;
      this.model.findById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results[0]);
      });
    }
  
    findAll(req, res) {
      this.model.findAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
      });
    }
  
    update(req, res) {
      const id = req.params.id;
      const data = req.body;
      this.model.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ id, ...data });
      });
    }
  
    delete(req, res) {
      const id = req.params.id;
      this.model.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Deleted successfully' });
      });
    }
  }
  
  module.exports = BaseController;
  