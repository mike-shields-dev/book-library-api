async function handleIdRequest(req, res, model) {
  const foundItem = await model.findByPk(req.params.id);
  if (!foundItem) {
    return res.status(404).json({ error: `${model.name} not found` });
  }
  req.item = foundItem;
}

function sanitizeIfNeeded(obj, model) {
  const dataValues = obj.get();
  if (model.name === "Reader") {
    delete dataValues?.password;
  }
  return obj;
}

exports.createItem = async (req, res, model) => {
  try {
    let newItem = await model.create(req.body);
    newItem = sanitizeIfNeeded(newItem, model);
    res.status(201).json(newItem);
  } catch (err) {
    let msg 
    if (err.name === "SequelizeUniqueConstraintError") {
      msg = err.errors[0].message;
    }
    if (err.name === "SequelizeValidationError") {
      msg = err.message.split(":")[1].trim();
    }
    return res.status(400).json({ error: msg });
  }
};

exports.readAllItems = async (req, res, model) => {
  let allItems = [...(await model.findAll())].map((item) =>
    sanitizeIfNeeded(item, model)
  );
  res.status(200).json(allItems);
};

exports.readOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  const item = sanitizeIfNeeded(req.item, model);
  res.status(200).json(item);
};

exports.updateOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  await req.item.update(req.body);
  const updatedItem = sanitizeIfNeeded(req.item, model);
  res.status(200).json(updatedItem);
};

exports.deleteOneItem = async (req, res, model) => {
  await handleIdRequest(req, res, model);
  await req.item.destroy();
  res.sendStatus(204);
};
