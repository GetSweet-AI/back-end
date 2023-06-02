import { StatusCodes } from "http-status-codes";
import BrandEngagement from "../model/BrandEngagement.js";

const saveBrandEngagement = async (req, res) => {
  const { Timezone, CompanySector, BrandTone, TargetAudience,PostType,postContent } = req.body;

  if (!Timezone || !CompanySector || !BrandTone | !TargetAudience | !PostType | !postContent) {
    throw new BadRequestError('Please provide all values')
  }
  req.body.createdBy = req.user.userId
  const brandEngagement = await BrandEngagement.create(req.body)
  res.status(StatusCodes.CREATED).json({ brandEngagement })
};

const getBrandManagements = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const brandManagements = await BrandEngagement.find({ createdBy: userId });

    res.status(StatusCodes.OK).json({ brandManagements });
  } catch (error) {
    next(error);
  }
};



export { saveBrandEngagement,getBrandManagements };
