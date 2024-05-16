import User from "../model/User.js";

const checkTrialStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (user && user.isTrialActive) {
      const trialEndDate = new Date(user.trialStartDate);
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      if (new Date() > trialEndDate && user.Plan === "Free") {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { isTrialActive: false } },
          { returnDocument: 'after' }
        );
        return res.status(200).json({ message: "Trial period ended", user: updatedUser });
      }
    }

    res.status(200).json({ message: "Trial status checked", user });
  } catch (error) {
    console.error("Error in checkTrialStatus controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkTrialStatus;
