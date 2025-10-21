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

app.listen(PORT, ()=>{
    console.log(`PixelTMDB Server is running on port ${PORT}`);
});
