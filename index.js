const { initializeDB } = require("./db.connect");
const SalesAgent = require("./models/salesAgent.model");
const Lead = require("./models/lead.model");
const Comment = require("./models/comment.model")
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const react = require("react");

const app = express();
app.use(cors());

const corsOptions = {
  origin: "*",
  Credential: true,
};

initializeDB();

const jsonData = fs.readFileSync("./jsons/salesAgent.json", "utf-8");
const salesAgent = JSON.parse(jsonData);

function seedData() {
  try {
    for (const saleAgent of salesAgent) {
      const newSalesAgent = new SalesAgent({
        name: saleAgent.name,
        email: saleAgent.email,
      });
      console.log(newSalesAgent.name);
      newSalesAgent.save();
    }
  } catch (error) {
    console.log("Error in seeding the data", error);
  }
}

// seedData();



// I was seeding data for lead from lead.json
const leadjsonData = fs.readFileSync("./jsons/lead.json", "utf-8");
const leads = JSON.parse(leadjsonData);

function seedData() {
  try {
    for (const lead of leads) {
      const newLead = new Lead({
        name: lead.name,
        source: lead.source,
        salesAgent: lead.salesAgent,
        status: lead.status,
        tags: lead.tags,
        timeToClose: lead.timeToClose,
        priority: lead.priority,
      });
      console.log(newLead.name, "newLeadName");
      newLead.save()
    }
  } catch (error) {
    console.log("Error in seeding the data", error);
  }
}

// seedData();



const leadData = {
    name: "Acme Corp",
    source: "Referral",
    salesAgent: "68e49fdf24fcc90c8e77b5bb",
    status: "New",
    tags: ["High Value", "Follow-up"],
    timeToClose: 30,
    priority: "High"
};


const addLead = async () => {
    try{
        const newLead = new Lead(leadData);
        await newLead.save();
        console.log(newLead, "Lead added successfully.")
    } catch(error){
        console.log("Error", error);
    }
};

// addLead();



//adding comment data in the database; 
const commentData = {
  lead: "68e4b4e7c0f4feb4e6795923", //lead Id. (Acme Corp)
  author: "68e49fdf24fcc90c8e77b5bb",  // Sales Agent ID  (Frank's Id)
  commentText: "Reached out to lead, waiting for response."
}


const commentData2 = {
    lead: "68e50c6f2cfcff7485308b23", //lead Id.  (Emily Rivera)
    author: "68e49fdf24fcc90c8e77b5be",  // Sales Agent ID (John Doe)
    commentText: "Lead interested, scheduled a meeting.",
}

const addComment = async () => {
    try{
        const newComment = new Comment(commentData2);
        await newComment.save();
        console.log(newComment, "Comment added successfully.")
    } catch(error){
        console.log("error", error)
    }
};

// addComment();   




//get all leads;

const getAllLeads = async () => {
    try{
        const allLeads = await Lead.find().populate("salesAgent"); 
        // console.log("All Leads: ", allLeads);
        return allLeads
    } catch(error){
        console.log("error", error)
    }
}

// getAllLeads();


// api for getting all leads;
app.get("/leads", async(req, res) => {
    try{
        const leadsAll = await getAllLeads()
        if(leadsAll){
            res.json(leadsAll)
        } else{
            res.status(404).json({ error: "Lead not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch Leads."})
    }
})

// get lead by Id;
async function getLeadById(leadId){
    try{
        const getLead = await Lead.findById(leadId);
        console.log(getLead);
        return getLead;
    } catch(error){
        throw error
    }
}

// getLeadById("68e50c6f2cfcff7485308b24")

// api to get lead by Id
app.get("/leads/:leadId", async(req, res) => {
    try{
        const leadById = await getLeadById(req.params.leadId)
        console.log(leadById)

        if(leadById){
            res.json(leadById)
        } else{
            res.status(404).json({error: 'Lead not found.'})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch Lead by Id."})
    }
})


//Get lead by status;
async function getLeadsByStatus(leadByStatus){
    try{
        const leadStatus = await Lead.find({status: leadByStatus})
        console.log(leadStatus)
        return leadStatus
    }
    catch(error){
        throw error
    }
}

// getLeadsByStatus("New")

// api to get leads by status.
app.get("/leads/status/:leadByStatus", async(req, res) => {
    try{
        const leadsStatus = await getLeadsByStatus(req.params.leadByStatus)
        if(leadsStatus){
            res.json(leadsStatus)
        } else{
            res.status(404).json({error: "Lead not found."})
        }
    } catch(error){
            res.status(500).json({error: "Failed to fetch Lead by Status."})
        }
})


// get leads by tags.
async function leadByTags(tag){
    try{
        const leadTags = await Lead.find({tags: tag})  
        console.log(leadTags)  
        return leadTags;
    }
    catch(error){
        throw error
    }
}
// leadByTags("Follow-up")

// api to get lead by tags.

app.get("/leads/tags/:tag", async(req, res) => {
    try{
        const leadTag = await leadByTags(req.params.tag)
        console.log(leadTag, "lead Tags")
        if(leadTag.length != 0){
            res.json(leadTag)
        } else{
             res.status(404).json({error: ".Lead not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch Lead by Tags."})
    }
})


// get leads by source

async function getLeadBySource(leadBySource){
    try{
        const sourceLead = await Lead.find({source: leadBySource})
        console.log(sourceLead)
        return sourceLead;
    } catch(error){
        throw error
    }
}

// getLeadBySource("Referral");

//api to get lead by source;

app.get("/leads/source/:leadBySource", async(req, res) => {
    try{
        const leadsSource = await getLeadBySource(req.params.leadBySource)
        if(leadsSource){
            res.json(leadsSource)
        } else{
            res.status(404).json({error: "Lead not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch Lead by Source."})
    }
})




// get All Sales agent*******; 

async function getAllSalesAgent(){
    try{
        const allSalesAgent = await SalesAgent.find()
        // console.log(allSalesAgent)
        return allSalesAgent
    } catch(error){
        console.log("error", error)
    }
}

// getAllSalesAgent();


app.get("/salesAgent", async(req, res) => {
    try{
        const salesAgents = await getAllSalesAgent();
        // console.log(salesAgents, "salesAgentslslje")
        if(salesAgents){
            res.json(salesAgents)
        } else{
             res.status(400).json({ error: "Sales agent is not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch Sales Agent."})
    }
})



// get salesAgent by Id;
async function getAgentById(agentId){
    try{
        const getSalesAgent = await SalesAgent.findById(agentId);
        // console.log(getSalesAgent, "getsales agetnekrtn");
        return getSalesAgent;
    } catch(error){
        throw error
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
    try{
        const salesAgent = await getAgentById(req.params.agentId)
        console.log(salesAgent, "salesagent")

        if(salesAgent){
            res.json(salesAgent)
        } else{
            res.status(404).json({error: "Sales agent is not found."})
        }
    } catch(error){
        res.status(500).json({error:  "Failed to fetch Sales Agent."})
    }
})



//get all comments from the db;
async function getAllComments(){
try{
const allComments = await Comment.find();
console.log(allComments, "all comments")
return allComments;
} catch(error){
    throw error
}
}

// getAllComments()

// api to get all comments;
app.get("/comments", async (req, res) => {
    try{
        const comments = await getAllComments();
        if(comments){
            res.json(comments)
        } else{
            res.status(404).json({error: "Comment not found."})
        }
    } catch(error){
        res.status(500).json({error: "{ error: 'Failed to fetch comments.' }"})
    }
})


//get comments by id; 
async function getCommentsById(commentsId){
    try{
        const commentsById = await Comment.findById(commentsId);
        console.log(commentsById)
        return commentsById;
    } catch(error){
        throw error
    }
}
// getCommentsById("68e4ce5699d3c8f7b9bfa0c7");

// api to get comment by id; 

app.get("/comments/:commentsId", async (req, res) => {
    try{
        const commentById = await getCommentsById(req.params.commentsId)
        console.log(commentById);
        if(commentById){
            res.json(commentById)
        } else{
            res.status(404).json({error: "Comment is not found."})
        }
    } catch(error){
        res.status(500).json({error: "{ error: 'Failed to fetch comments.' }."})
    }
})

//Reporting Api;
//get leads closed last weak; 

// Description: Fetches all leads that were closed (status: Closed) in the last 7 days.

// app.get("/leads/report/last-week", async (req, res) => {
//     try{
//         const sevenDaysAgo = new Date();
//         console.log(sevenDaysAgo, "sevendaysago")
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 
        
//         const closedLeads = await Lead.find({
//             status: "Closed",
//             closedAt: {$gte: sevenDaysAgo}   //In the code, $gte is a MongoDB query operator that means "greater than or equal to".
//         });
        
//         if(closedLeads){
//             res.json(closedLeads)
//         } else{
//             res.status(404).json({error: "Lead not found."})
//         }
//     } catch(error){
//         res.status(500).json({ error: 'Failed to fetch closed Leads' })
//     }
// })

async function closedLeadsInSevenDays(){
    try{
    const sevenDaysAgo = new Date();
    console.log(sevenDaysAgo, "sevendaysago")
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

    const closedLeads = await Lead.find({
            status: "Closed",
            closedAt: {$gte: sevenDaysAgo}   //In the code, $gte is a MongoDB query operator that means "greater than or equal to".
        });
    console.log(closedLeads, "closedLeads")
    return closedLeads
    } catch(error){
        throw error
    }     
}

closedLeadsInSevenDays();


//Get lead by status;
async function getLeadsByStatus(leadByStatus){
    try{
        const leadStatus = await Lead.find({status: leadByStatus})
        console.log(leadStatus)
        return leadStatus
    }
    catch(error){
        throw error
    }
}

getLeadsByStatus("Closed")

// api to get leads by status.
app.get("/leads/status/:leadByStatus", async(req, res) => {
    try{
        const leadsStatus = await getLeadsByStatus(req.params.leadByStatus)
        if(leadsStatus){
            res.json(leadsStatus)
        } else{
            res.status(404).json({error: "Lead not found."})
        }
    } catch(error){
            res.status(500).json({error: "Failed to fetch Lead by Status."})
        }
})








const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
})
