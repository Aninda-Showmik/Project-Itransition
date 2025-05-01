// Example controller for creating a form and getting all forms
const createForm = async (req, res) => {
    const { title, description } = req.body;
    try {
      // Assuming you have a Form model (e.g., Sequelize model)
      const form = await Form.create({ title, description, userId: req.auth.userId });
      res.status(201).json(form);
    } catch (error) {
      console.error("Error creating form:", error);
      res.status(500).json({ message: "Failed to create form" });
    }
  };
  
  const getForms = async (req, res) => {
    try {
      // Fetch forms for the authenticated user
      const forms = await Form.findAll({ where: { userId: req.auth.userId } });
      res.status(200).json(forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
      res.status(500).json({ message: "Failed to fetch forms" });
    }
  };
  
  export { createForm, getForms };
  