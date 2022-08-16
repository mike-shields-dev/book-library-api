async function handleIdRequest (req, res, model, itemName) {
    const foundItem = await model.findByPk(req.params.id);
    if(!foundItem) {
        return res.status(404).json({ error: `${itemName} not found`});
    }
    req.item = foundItem;
}

exports.createItem = async (req, res, model) => {
    try {
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}    

exports.readAllItems = async (_, res, model) => {
    const allItems = await model.findAll();
    res.status(200).json(allItems);
}

exports.readOneItem = async (req, res, model, itemName) => {
    await handleIdRequest(req, res, model, itemName)
    res.status(200).json(req.item);
}

exports.updateOneItem = async (req, res, model, itemName) => {
    await handleIdRequest(req, res, model, itemName)
    await req.item.update(req.body);
    res.status(200).json(req.item);
}

exports.deleteOneItem = async (req, res, model, itemName) => {
    await handleIdRequest(req, res, model, itemName)
    await req.item.destroy();
    res.sendStatus(204);
}
