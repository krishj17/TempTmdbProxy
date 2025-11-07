import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({"Message": "Welcome to the PixelTMDB API Server!",
    "Available Endpoints": {
        "/tmdb/trending": "GET - Fetch trending movies/TV shows from TMDB",
        "/tmdb/:type/:id": "GET - Fetch details of a movie or TV show by type and ID"
    }
  });
});

app.get("/tmdb/trending", async (req, res)=>{
    try{
        const page = req.query.page || 1;
        const tmdbres = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.TMDB_API_KEY}&page=${page}`);
        const tmdbdata = await tmdbres.json();
        res.status(200).json({status: "success", tmdbdata: tmdbdata});
    } catch(error){
        console.log("Error in /tmdb/trending route:", error);
        res.status(500).json({status:"error", message: "Internal Server Error"});
    }
});


// get movie / shows details:
app.get("/tmdb/:type/:id", async (req, res) =>{
    try{
        const { type, id } = req.params;
        const tmdbres = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`);
        const tmdbdata = await tmdbres.json();
        res.status(200).json({status: "success", tmdbdata: tmdbdata});
    } catch(error){
        console.log("Error in /tmdb/:type/:id route:", error);
        res.status(500).json({status:"error", message: "Internal Server Error"});
    }
});


// tmdb helper route to get all ids
app.get("/tmdb/:type/:id/external_ids", async (req, res) =>{
    try{
        const { type, id } = req.params;
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`);
        const allIds = await response.json();
        res.status(200).json({status: "success", allIds: allIds});
    } catch(error){
        console.log("Error in /tmdb/:type/:id/external_ids route:", error);
        res.status(500).json({status:"error", message: "Internal Server Error"});
    }
});

app.listen(PORT, ()=>{
    console.log(`PixelTMDB Server is running on port ${PORT}`);
});
