module.exports  = async function (req, res, model) {
    const foundItem = await model.findByPk(req.params.id);
    if(!foundItem) {
        return res.status(404).json({ error: `${model.name} not found`});
    }
    req.item = foundItem;
}