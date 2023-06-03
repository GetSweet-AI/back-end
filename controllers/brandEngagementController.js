import { StatusCodes } from "http-status-codes";
import BrandEngagement from "../model/BrandEngagement.js";
import { badRequestError, notFoundError} from "../errors/index.js";

const saveBrandEngagement = async (req, res) => {
  const { Timezone, CompanySector, BrandTone, TargetAudience,PostType,postContent } = req.body;

  if (!Timezone || !CompanySector || !BrandTone | !TargetAudience | !PostType | !postContent) {
    throw new badRequestError('Please provide all values')
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

const deleteBrandEngagement = async (req, res) => {
  const { id: brandId } = req.params

  const brandEngagement = await BrandEngagement.findOne({ _id: brandId })

  if (!brandEngagement) {
    throw new notFoundError(`No brandEngagement with id :${brandId}`)
  }

  // checkPermissions(req.user, brandEngagement.createdBy)

  await brandEngagement.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! brandEngagement removed' })
}



export { saveBrandEngagement,getBrandManagements, deleteBrandEngagement };
