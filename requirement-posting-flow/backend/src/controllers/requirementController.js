import Requirement from '../models/Requirement.js';

export const createRequirement = async (req, res) => {
  const requirement = await Requirement.create(req.body);

  res.status(201).json({
    success: true,
    data: requirement,
  });
};

export const getRequirementById = async (req, res) => {
  const requirement = await Requirement.findById(req.params.id);

  if (!requirement) {
    res.status(404);
    throw new Error(`Requirement with id "${req.params.id}" not found`);
  }

  res.status(200).json({
    success: true,
    data: requirement,
  });
};
