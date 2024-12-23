router.post('/login', async (req, res) => {
  try {
    const { email, supabaseUserId } = req.body;

    // Find adjuster by email or supabaseUserId
    const adjuster = await Adjuster.findOne({
      $or: [
        { email: email.toLowerCase() },
        { supabaseUserId: supabaseUserId }
      ]
    });

    if (!adjuster) {
      return res.status(404).json({ message: "Adjuster not found" });
    }

    // Return adjuster data without sensitive information
    const adjusterData = {
      _id: adjuster._id,
      name: adjuster.name,
      email: adjuster.email,
      phone: adjuster.phone,
      status: adjuster.status,
      progress: adjuster.progress,
      supabaseUserId: adjuster.supabaseUserId
    };

    res.json(adjusterData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}); 