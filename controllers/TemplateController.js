  import { StatusCodes } from "http-status-codes";
  import dotenv from "dotenv";
  import Template from "../model/Template.js";
  import notFoundError from "../errors/not-found.js";
  import User from "../model/User.js";
  import TemplateArchive from "../model/TemplateArchive.js";
  import badRequestError from "../errors/bad-request.js";

  dotenv.config(); 

  //Add new template
  const addNewTemplate = async (req, res) => {
      try {
        const { startDate,endDate,lifeCycleStatus,Title, CompanySector, BrandTone } = req.body;
    
        if (!Title || !BrandTone  ) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Title and BrandTone are required fields' });
        }
        
        const userId = req.params.userId; // Extract the userId from the route parameter
    
        if (!userId) {
          throw new badRequestError('User ID not found');
        }
        const brandTemplate = await Template.create({
          Title,
          CompanySector,
          BrandTone,
          endDate,
          startDate,
          lifeCycleStatus,
          createdBy: userId // Set createdBy to the userId
        });
        res.status(StatusCodes.CREATED).json({ brandTemplate });
      } catch (error) {
        // Handle the error within the catch block
        // console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
      }
  };

  //Delete template 
  const archiveTemplate = async (req, res) => {

    const { temId } = req.query
  
    const userId = req.params.userId; // Extract the userId from the route parameter
  
    if (!userId) {
      throw new badRequestError('User ID not found');
    }
    
    const template = await Template.findOne({ _id: temId })
  
    if (!template) {
      throw new notFoundError(`No template found with id :${temId}`)
    }
  
    const archiveBrandEngagement = await TemplateArchive.create({
      Title: template.Title,
      Timezone: template.Timezone,
      CompanySector: template.CompanySector,
      BrandTone: template.BrandTone,

      createdBy: userId // Set createdBy to the userId
    });
  
    // checkPermissions(req.user, brandEngagement.createdBy)
  
    await template.remove()
  
    res.status(StatusCodes.OK).json({ msg: 'Success! template removed', template })
  } 

  //Get all templates
  const getTemplates = async (req, res, next) => {
    try {
      const { userId } = req.query;
  
      // Check if the user with the provided userId exists and has the "admin" role
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw new badRequestError('User ID not found');
      }
  
      const currentDate = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  
      // Fetch templates that either run forever or have an endDate greater than the current date
      const templates = await Template.find({
        $or: [
          { lifeCycleStatus: "RunForEver" },
          { 
            lifeCycleStatus: "HasEndDate",
            endDate: { $gt: currentDate }
          }
        ]
      });
  
      // Return the filtered templates as a response
      res.status(200).json({ templates });
    } catch (error) {
      next(error);
    }
  };
  
  // const getTemplates = async (req, res, next) => {
  //   try {
  //     const { userId } = req.query;
  
  //     // Check if the user with the provided userId exists and has the "admin" role
  //     const user = await User.findOne({ _id: userId, role: "admin" });

  //     if (!user) {
  //       // If the user is not found or is not an admin, return a forbidden error
  //       return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to perform this action" });
  //     }

  //     const PAGE_SIZE = 6;
  //     const page = parseInt(req.query.page || "0");
  //     // Your logic to retrieve brand engagements based on the user ID
  //     const templates = await Template.find({})
  //     .limit(PAGE_SIZE)
  //     .skip(PAGE_SIZE * page);
  
  //     const total = await Template.countDocuments({});

  //     // Return the brand engagements as a response
  //     res.status(200).json({ total,totalPages: Math.ceil(total / PAGE_SIZE),templates });
  //   } catch (error) {
  //     next(error);
  //   }
  // };


export { addNewTemplate,getTemplates,archiveTemplate };
