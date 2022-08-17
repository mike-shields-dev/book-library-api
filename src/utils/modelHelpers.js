async function handleIdRequest(req, res, model) {
  const foundItem = await model.findByPk(req.params.id);
  if (!foundItem) {
    return res.status(404).json({ error: `${model.name} not found` });
  }
  req.item = foundItem;
}

function sanitize(obj) {
  delete obj?.password;
  return obj;
}


exports.createItem = async (req, res, model) => {
  try {
    const newItem = await model.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.readAllItems = async (_, res, model) => {
  const allItems = [...(await model.findAll())].map(sanitize);
  res.status(200).json(allItems);
};

exports.readOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  res.status(200).json(sanitize(req.item));
};

exports.updateOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  await req.item.update(req.body);
  res.status(200).json(sanitize(req.item));
};

exports.deleteOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  await req.item.destroy();
  res.sendStatus(204);
};
