exports.createItem = async (req, res, model) => {
    try {
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}    

exports.readAllItems = async (req, res, model) => {
    const allItems = await model.findAll();
    res.status(200).json(allItems);
}

exports.readOneItem = async (req, res, model, itemName) => {
    const item = await model.findByPk(req.params.id);
    if(!item) {
        return res.status(404).json({ error: `${itemName} not found`});
    }
    res.status(200).json(item);
}

exports.updateOneItem = async (req, res, model, itemName) => {
    const item = await model.findByPk(req.params.id);
    if(!item) {
        return res.status(404).json({ error: `${itemName} not found`});
    }
    const updatedItem = await item.update(req.body);
    res.status(200).json(updatedItem);
}

exports.deleteOneItem = async (req, res, model, itemName) => {
    const item = await model.findByPk(req.params.id);
    if(!item) {
        return res.status(404).json({ error: `${itemName} not found`});
    }
    await item.destroy();
    res.sendStatus(204);
}
