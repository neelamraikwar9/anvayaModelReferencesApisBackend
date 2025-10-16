const { initializeDB } = require("./db.connect");
const SalesAgent = require("./models/salesAgent.model");
const Lead = require("./models/lead.model");
const Comment = require("./models/comment.model");
const Tag = require("./models/tag.model");
// const fs = require("fs");
const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json()); //middleware

const corsOptions = {
  origin: "*",
  Credential: true,
};

initializeDB();

// const jsonData = fs.readFileSync("./jsons/salesAgent.json", "utf-8");
// const salesAgent = JSON.parse(jsonData);

// function seedData() {
//   try {
//     for (const saleAgent of salesAgent) {
//       const newSalesAgent = new SalesAgent({
//         name: saleAgent.name,
//         email: saleAgent.email,
//       });
//       console.log(newSalesAgent.name);
//       newSalesAgent.save();
//     }
//   } catch (error) {
//     console.log("Error in seeding the data", error);
//   }
// }

// seedData();

// I was seeding data for lead from lead.json
// const leadjsonData = fs.readFileSync("./jsons/lead.json", "utf-8");
// const leads = JSON.parse(leadjsonData);

// function seedData() {
//   try {
//     for (const lead of leads) {
//       const newLead = new Lead({
//         name: lead.name,
//         source: lead.source,
//         salesAgent: lead.salesAgent,
//         status: lead.status,
//         tags: lead.tags,
//         timeToClose: lead.timeToClose,
//         priority: lead.priority,
//       });
//       console.log(newLead.name, "newLeadName");
//       newLead.save()
//     }
//   } catch (error) {
//     console.log("Error in seeding the data", error);
//   }
// }

// seedData();

// const leadData = {
//     name: "Acme Corp",
//     source: "Referral",
//     salesAgent: "68e49fdf24fcc90c8e77b5bb",
//     status: "New",
//     tags: ["High Value", "Follow-up"],
//     timeToClose: 30,
//     priority: "High"
// };

// const addLead = async () => {
//     try{
//         const newLead = new Lead(leadData);
//         await newLead.save();
//         console.log(newLead, "Lead added successfully.")
//     } catch(error){
//         console.log("Error", error);
//     }
// };

// // addLead();

//adding comment data in the database;
// const commentData = {
//   lead: "68e4b4e7c0f4feb4e6795923", //lead Id. (Acme Corp)
//   author: "68e49fdf24fcc90c8e77b5bb",  // Sales Agent ID  (Frank's Id)
//   commentText: "Reached out to lead, waiting for response."
// }

// const commentData2 = {
//     lead: "68e50c6f2cfcff7485308b23", //lead Id.  (Emily Rivera)
//     author: "68e49fdf24fcc90c8e77b5be",  // Sales Agent ID (John Doe)
//     commentText: "Lead interested, scheduled a meeting.",
// }

// const addComment = async () => {
//     try{
//         const newComment = new Comment(commentData2);
//         await newComment.save();
//         console.log(newComment, "Comment added successfully.")
//     } catch(error){
//         console.log("error", error)
//     }
// };

// // addComment();

// const closedLead = {
//     name: "David Chen",
//     source: "Cold Call",
//     salesAgent: "68e49fdf24fcc90c8e77b5bc",
//     status: "Closed",
//     tags: ["High Value", "Follow-up"],
//     timeToClose: 60,
//     priority: "Medium",
//     closedAt: "2025-07-10"
//   }

//   const addClosedLead = async () => {
//     try{
//         const leadNew = new Lead(closedLead);
//         await leadNew.save();
//         console.log(leadNew, "Comment added successfully.")
//     } catch(error){
//         console.log("error", error)
//     }
// };

// // addClosedLead();

// // add tags;
// const newTags2 =
//     // {
//     // name: "High value"
//     // }

//     {
//     name: "Follow-Up"
//     }

// const addNewTag = async () => {
//     try{
//     const newTag = new Tag(newTags2);
//     await newTag.save();
//     console.log(newTag, "Tag added successfully.")
//     } catch(error){
//         throw error
//     }
// }
// // addNewTag();

//POST Method;
//api to post leads in the database; overall post route for leads.

// lead to put in request body;
// {
//   "name": "Step Up",
//   "source": "Email",
//   "salesAgent": "68e8c8c399ce051eacc8976e",   // Sales Agent ID
//   "status": "Qualified",
//   "tags": ["High Value"],
//   "timeToClose": 40,
//   "priority": "High"
// }

async function createLead(newLead) {
  try {
    const lead = new Lead(newLead);
    const saveLead = await lead.save();
    console.log(saveLead);
    return saveLead;
  } catch (error) {
    throw error;
  }
}

app.post("/leads", async (req, res) => {
  try {
    const newLead = req.body;
    const savedLead = await createLead(newLead);
    console.log(savedLead);
    res
      .status(201)
      .json({ message: "Lead crated successfully.", lead: savedLead });
  } catch (error) {
    console.error("Error creating lead:", error); // log stack trace and message
    res.status(500).json({ error: "Failed to create a Lead." });
  }
});

//get all leads;

const getAllLeads = async () => {
  try {
    const allLeads = await Lead.find().populate("salesAgent");
    // console.log("All Leads: ", allLeads);
    return allLeads;
  } catch (error) {
    console.log("error", error);
  }
};

// getAllLeads();

// GET Method;
// api for getting all leads;
app.get("/leads", async (req, res) => {
  try {
    const leadsAll = await getAllLeads();
    if (leadsAll) {
      res.json(leadsAll);
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Leads." });
  }
});

// get lead by Id;
async function getLeadById(leadId) {
  try {
    const getLead = await Lead.findById(leadId);
    console.log(getLead);
    return getLead;
  } catch (error) {
    throw error;
  }
}

// getLeadById("68e50c6f2cfcff7485308b24")

// api to get lead by Id
app.get("/leads/:leadId", async (req, res) => {
  try {
    const leadById = await getLeadById(req.params.leadId);
    console.log(leadById);

    if (leadById) {
      res.json(leadById);
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Lead by Id." });
  }
});

//Get lead by status;
async function getLeadsByStatus(leadByStatus) {
  try {
    const leadStatus = await Lead.find({ status: leadByStatus });
    console.log(leadStatus);
    return leadStatus;
  } catch (error) {
    throw error;
  }
}

// getLeadsByStatus("New")

// api to get leads by status.
app.get("/leads/status/:leadByStatus", async (req, res) => {
  try {
    const leadsStatus = await getLeadsByStatus(req.params.leadByStatus);
    if (leadsStatus) {
      res.json(leadsStatus);
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Lead by Status." });
  }
});


//get leads by sales agent; 
async function getLeadsByAgent(salesAgentId) {
  try{
    const leadByAgent = await Lead.find({salesAgent : salesAgentId});
    console.log(leadByAgent, "lead by slaes agnt");
    return leadByAgent;
  } catch(error){
    throw error;
  }
}

// getLeadsByAgent("68e49fdf24fcc90c8e77b5bc");

// api to get lead by sales agent;

app.get("/leads/agent/:salesAgentId", async (req, res) => {
  try{
    const leadByAgentId = await getLeadsByAgent(req.params.salesAgentId);
    console.log(leadByAgentId, "leadbysagentId")
    if(leadByAgentId.length > 0) {
      res.json(leadByAgentId);
    } else{
      res.status(404).json({error: "Lead not found."});
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetch Lead by salesAgent Id."});
  }
});

// get leads by tags.
async function leadByTags(tag) {
  try {
    const leadTags = await Lead.find({ tags: tag });
    console.log(leadTags);
    return leadTags;
  } catch (error) {
    throw error;
  }
}
// leadByTags("Follow-up")

// api to get lead by tags.

app.get("/leads/tags/:tag", async (req, res) => {
  try {
    const leadTag = await leadByTags(req.params.tag);
    console.log(leadTag, "lead Tags");
    if (leadTag.length != 0) {
      res.json(leadTag);
    } else {
      res.status(404).json({ error: ".Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Lead by Tags." });
  }
});

// get leads by source

async function getLeadBySource(leadBySource) {
  try {
    const sourceLead = await Lead.find({ source: leadBySource });
    console.log(sourceLead);
    return sourceLead;
  } catch (error) {
    throw error;
  }
}

// getLeadBySource("Referral");

//api to get lead by source;

app.get("/leads/source/:leadBySource", async (req, res) => {
  try {
    const leadsSource = await getLeadBySource(req.params.leadBySource);
    if (leadsSource) {
      res.json(leadsSource);
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Lead by Source." });
  }
});

//post new Sales Agent;

// async function createSalesAgent(newAgent){
//   try{
//     const agent = new SalesAgent(newAgent);
//     const savedAgent = await agent.save();
//     return savedAgent;
//   } catch(error){
//     throw error;
//   }
// }

//api to post new sales agent;

// app.post("/salesAgent", async (req, res) => {
//   try{
//     const saveAgent = await createSalesAgent(newAgent);
//     console.log(saveAgent)
// res.status(201).json({message: "Sales Agent added successfully.", agent : savedAgent})
//     // res.status(201).json({message: "Movie added successfully.", movie: savedMovie})
//   } catch(error){
//     res.status(500).json({error: "Failed to add Sales Agent."})
//   }
// })

//api to add/ post sales agent;
async function createSalesAgent(newAgent) {
  try {
    const agent = new SalesAgent(newAgent);
    const saveAgent = await agent.save();
    console.log(saveAgent, "save agent");
    return saveAgent;
  } catch (error) {
    throw error;
  }
}

app.post("/salesAgent", async (req, res) => {
  try {
    const newAgent = req.body;
    const savedAgent = await createSalesAgent(newAgent);
    console.log(savedAgent, "checking savedAgent");
    res
      .status(201)
      .json({ message: "Sales Agent added successfully.", agent: savedAgent });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Sales Agent." });
  }
});

// get All Sales agent*******;

async function getAllSalesAgent() {
  try {
    const allSalesAgent = await SalesAgent.find();
    // console.log(allSalesAgent)
    return allSalesAgent;
  } catch (error) {
    console.log("error", error);
  }
}

// getAllSalesAgent();

app.get("/salesAgent", async (req, res) => {
  try {
    const salesAgents = await getAllSalesAgent();
    // console.log(salesAgents, "salesAgentslslje")
    if (salesAgents) {
      res.json(salesAgents);
    } else {
      res.status(400).json({ error: "Sales agent is not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Sales Agent." });
  }
});

// get salesAgent by Id;
async function getAgentById(agentId) {
  try {
    const getSalesAgent = await SalesAgent.findById(agentId);
    // console.log(getSalesAgent, "getsales agetnekrtn");
    return getSalesAgent;
  } catch (error) {
    throw error;
  }
}
// getAgentById("68e49fdf24fcc90c8e77b5bc")

//have to chek it;......................
// api to get salesAgent by Id;

// app.get("/salesAgent/:agentId", async(req, res) => {
//     try{
//         const salesAgentById = await getAgentById(req.params.agentId)
//         console.log(salesAgentById, "checking sales agent");
//         if(salesAgentById){
//             req.json(salesAgentById)
//         } else{
//             res.status(404).json({error: "salesAgent is not found."})
//         }
//     }  catch(error){
//         res.status(500).json({error: "An unexpected error occurred on the server."})
//     }
// })

app.get("/salesAgent/getSalesAgent/:agentId", async (req, res) => {
  try {
    const salesAgent = await getAgentById(req.params.agentId);
    console.log(salesAgent, "salesagent");

    if (salesAgent) {
      res.json(salesAgent);
    } else {
      res.status(404).json({ error: "Sales agent is not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Sales Agent." });
  }
});

//api to post/Add comments;

// comment to post;
// {
//     "lead": "68e8ce0c481cf6a6f5d7dc7e",
//     "author": "68e8c8c399ce051eacc8976e",
//     "commentText": "Lead interested, join a meeting."
// }

const addNewComment = async (newComment) => {
  try {
    const comment = new Comment(newComment);
    const savedComm = await comment.save();
    console.log(savedComm);
    return savedComm;
  } catch (error) {
    throw error;
  }
};

app.post("/comments", async (req, res) => {
  try {
    const newComment = req.body;
    const newComm = await addNewComment(newComment);
    console.log(newComm);
    res
      .status(201)
      .json({ message: "Comment added successfully.", comment: newComm });
  } catch (error) {
    res.status(500).json({ error: "Failed to add a Comment." });
  }
});

//get all comments from the db;
async function getAllComments() {
  try {
    const allComments = await Comment.find().populate("author");
    console.log(allComments, "all comments");
    return allComments;
  } catch (error) {
    throw error;
  }
}

// getAllComments()

// api to get all comments;
app.get("/comments", async (req, res) => {
  try {
    const comments = await getAllComments();
    if (comments) {
      res.json(comments);
    } else {
      res.status(404).json({ error: "Comment not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "{ error: 'Failed to fetch comments.' }" });
  }
});

//get comments by id;
async function getCommentsById(commentsId) {
  try {
    const commentsById = await Comment.findById(commentsId);
    console.log(commentsById);
    return commentsById;
  } catch (error) {
    throw error;
  }
}
// getCommentsById("68e4ce5699d3c8f7b9bfa0c7");

// api to get comment by id;

app.get("/comments/:commentsId", async (req, res) => {
  try {
    const commentById = await getCommentsById(req.params.commentsId);
    console.log(commentById);
    if (commentById) {
      res.json(commentById);
    } else {
      res.status(404).json({ error: "Comment is not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "{ error: 'Failed to fetch comments.' }." });
  }
});

//Reporting Api;
//get leads closed last weak;
// Description: Fetches all leads that were closed (status: Closed) in the last 7 days.
//Get closed leads within last 7 days.

// async function getClosedLeads() {
//   try {
//     const sevenDaysAgo = new Date();
//     console.log(sevenDaysAgo, "sevendaysago");
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     const closedLeads = await Lead.find({
//       status: "Closed",
//       closedAt: { $gte: sevenDaysAgo },
//     });
//     console.log(closedLeads, "checking closed leads. ");
//     return closedLeads;
//   } catch (error) {
//     throw error;
//   }
// }

// getClosedLeads()

async function getClosedLeads() {
  try {
    const today = new Date();
    console.log(today, "today");
    const sevenDaysAgo = 
    new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    console.log(sevenDaysAgo, "sevenDaysAgo");
    const closedLeads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: sevenDaysAgo },
    });
    console.log(closedLeads, "checking closed leads. ");
    return closedLeads;
  } catch (error) {
    throw error;
  }
}

// getClosedLeads()

// api to get closed leads within last Week;
app.get("/leads/report/lastWeek", async (req, res) => {
  try {
    const leadClosed = await getClosedLeads();
    console.log(leadClosed, "lead Closed");
    if (leadClosed) {
      res.json(leadClosed);
    } else {
      res.status(404).json({ error: "Closed leads not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch closed leads." });
  }
});

// Get Total Leads in Pipeline**
// GET /report/pipeline`
// Description**: Fetches the total number of leads currently in the pipeline (all statuses except `Closed`).

async function getTotalLeadsInPipeline() {
  try {
    const totalLeadsInPipeLine = await Lead.countDocuments({
      status: { $ne: "Closed" },
    });
    console.log(totalLeadsInPipeLine, "totalLeadsInPipeLine....klfjkdljkdjfk");
    return totalLeadsInPipeLine;
  } catch (error) {
    console.log(error, "error");
  }
}
// getTotalLeadsInPipeline();

app.get("/leads/report/pipeline", async (req, res) => {
  try {
    const totalLeads = await getTotalLeadsInPipeline();
    console.log(totalLeads, "leads count");
    if (totalLeads) {
      res.status(200).json({ totalLeadsInPipeline: totalLeads });
    } else {
      res.status(404).json({ error: "Total Leads in pipeline is not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch total Leads." });
  }
});

//get closed leads in the pipeline;
const closedLeadInPipeline = async() => {
  try{
    const totalClosedLead = await Lead.countDocuments({status: "Closed" })
    console.log(totalClosedLead, "totalClosedLead")
    return totalClosedLead;
  } catch(error){
    console.log(error, "error")
  }
}

// closedLeadInPipeline();

app.get("/leads/report/closedLeads/pipeline", async (req, res) => {
  try{
    const closedLeads = await closedLeadInPipeline();
    console.log(closedLeads, "closedLeads");
    if(closedLeads){
      res.status(200).json({totalClosedLeadsInPipeline: closedLeads});
    } else{
      res.status(404).json({error: "Total Closed Leads in pipeline is not found." })
    }
  } catch(error){
    res.status(500).json({error: "Cannot fetch total Closed Leads." })
  }
})


// get all tags;
const getAllTags = async () => {
  try {
    const allTags = await Tag.find();
    console.log(allTags, "allTags");
    return allTags;
  } catch (error) {
    throw error;
  }
};

// getAllTags();

app.get("/tags", async (req, res) => {
  try {
    const tags = await getAllTags();
    if (tags) {
      res.json(tags);
    } else {
      res.status(404).json({ error: "Tags not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch Tags." });
  }
});

//api for update Lead;
//update lead by changing status;
async function updateLeadByStatus(leadID, dataToUpdate) {
  try {
    const updateLead = await Lead.findByIdAndUpdate(leadID, dataToUpdate, {
      new: true,
    });
    return updateLead;
  } catch (error) {
    console.log("Error in updating Lead status.", error);
  }
}

// updateLeadByStatus("68e8ce0c481cf6a6f5d7dc7e", {status: "New"})

app.post("/leads/:leadID", async (req, res) => {
  try {
    const updatedLead = await updateLeadByStatus(req.params.leadID, req.body);
    if (updatedLead) {
      res.status(200).json({
        message: "Lead updated successfully.",
        updateLeadByStatus: updatedLead,
      });
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Lead." });
  }
});

// api for deleting a lead;
async function deleteLead(ledId) {
  try {
    const leadDelete = await Lead.findByIdAndDelete(ledId);
    console.log(leadDelete, "Lead deleted successfully.");
    return leadDelete;
  } catch (error) {
    console.log(error);
  }
}
// deleteLead("68e8ccc1a9f8b416043842d7");

app.delete("/leads/:ledId", async (req, res) => {
  try {
    const deleteLed = deleteLead(req.params.ledId);
    if (deleteLed) {
      res.status(200).json({ message: "Lead deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Lead." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
