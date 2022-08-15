exports.createItem = async (req, res, model) => {
    try {
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}    
