// TODO: simplify imports
import { useEffect, useState } from "react";
import { Box, Button, Card, Typography, Container, Grid, Divider, IconButton, Modal, CircularProgress } from "@mui/material";
import "@fontsource/libre-franklin/900.css";
import "@fontsource/libre-franklin/200.css";
import "@fontsource/libre-franklin/300.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/600.css";
import "@fontsource/libre-franklin/700.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWords, submitWords } from "./api.ts";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CircleIcon from '@mui/icons-material/Circle';

// TODO: consider adding a color to the category for future use
type Category = {
  category: string;
  words: string[];
}

function App() {
  // the words the user has currently selected
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // all the words the user can choose from
  const [allWords, setAllWords] = useState<string[]>([]);
  // the categories the user has completed
  const [completedCategories, setCompletedCategories] = useState<Category[]>([]);
  // the modal for the stats
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  // the modal for the info
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  // the words queried from the backend
  const { data: backendWords = [] } = useQuery({ 
    queryKey: ["words"], 
    queryFn: fetchWords,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  });

  // when the backend words are fetched, set allWords to the backend words
  useEffect(() => {
    setAllWords(backendWords);
  }, [backendWords]);

  const submitWordsMutation = useMutation({
    mutationFn: submitWords,
    // TODO: consider removing success from data; likely not needed here
    onSuccess: (data) => {
      const category: Category = {
        category: data.category,
        words: selectedWords
      };
      setCompletedCategories([...completedCategories, category]);
      setSelectedWords([]);
      setAllWords(allWords.filter((word) => !selectedWords.includes(word)));
    },
    onError: () => {
      console.error("Error submitting words");
    }
  });

  // shuffles an array
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; 
    }
    return newArray;
  };

  // TODO: find a better way to shuffle the colors
  const [colors] = useState(() => {
    const baseColors = ["#f8df6b", "#a1c35b", "#b0c3ef", "#b981c5"];
    for (let i = baseColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baseColors[i], baseColors[j]] = [baseColors[j], baseColors[i]];
    }
    return baseColors;
  });

  // the app component
  return (
    <Container style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
      <Modal 
        open={statsModalOpen} 
        onClose={() => setStatsModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography fontSize={"20px"} fontFamily={"Libre Franklin"} fontWeight={900} >
            Statistics
          </Typography>
          
        </Box>
      </Modal>
      <Modal 
        open={infoModalOpen} 
        onClose={() => setInfoModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          Info content goes here
        </Box>
      </Modal>
    

      <Typography variant="h4" gutterBottom fontFamily={"Libre Franklin"} fontWeight={900} onClick={() => console.log("add navigation at some point")} >
        Infinite Connections
      </Typography> 
      <Divider>
      </Divider>
      <Box display="flex" justifyContent="center" gap={2} marginTop={"10px"} marginBottom={"10px"}>
          <IconButton sx={{ color: 'black', "&:hover": { bgcolor: 'white' } }} onClick={() => setStatsModalOpen(true)} disableRipple>
            <EmojiEventsOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: 'black', "&:hover": { bgcolor: 'white' } }} onClick={() => setInfoModalOpen(true)} disableRipple>
            <InfoOutlinedIcon />
          </IconButton>
        </Box>
      <Divider></Divider>
      <Typography fontFamily={"Libre Franklin"} fontWeight={400} marginTop={"20px"} marginBottom={"20px"}>
        Create four groups of four!
      </Typography>
      <Container style={{ width: "60%" }}>
      {backendWords.length === 0 ? <CircularProgress size={20} sx={{color: "grey"}} /> : <></>}
      <Grid container spacing={1} justifyContent="center">
        {completedCategories.map((category, index) => (
          <Grid item xs={12} key={index}>
            <Card
              sx={{ 
                borderRadius: "6px", 
                boxShadow: "none", 
                padding: 2.5, 
                backgroundColor: colors[index], 
                color: "black",
                animation: allWords.length > 0 ? 'flyInAndPop 0.5s ease-in-out' : 'none',
                '@keyframes flyInAndPop': {
                  '0%': {
                    transform: 'translateY(20px) scale(1)',
                    opacity: 0
                  },
                  '60%': {
                    transform: 'translateY(0) scale(1)',
                    opacity: 1
                  },
                  '80%': {
                    transform: 'translateY(0) scale(1.1)',
                  },
                  '100%': {
                    transform: 'translateY(0) scale(1)',
                  }
                }
              }}
            >
              <Typography fontFamily={"Libre Franklin"} fontWeight={700} fontSize={"16px"}>{category.category.toUpperCase()}</Typography>
              <Typography fontFamily={"Libre Franklin"} fontWeight={500} fontSize={"16px"}>{category.words.map((word) => word.toUpperCase()).join(", ")}</Typography>
            </Card>
            
          </Grid>
        ))}
        {allWords.map((word, index) => (
          <Grid item xs={3} key={index}>
            <Card
              sx={{ 
                userSelect: "none", 
                borderRadius: "6px", 
                boxShadow: "none", 
                padding: 4, 
                cursor: "pointer", 
                backgroundColor: selectedWords.includes(word) ? "#59594e" : "#efeee6", 
                color: selectedWords.includes(word) ? "white" : "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              }}
              onClick={() => {
                if (selectedWords.includes(word)) {
                  setSelectedWords(selectedWords.filter((w) => w !== word));
                } else if (selectedWords.length < 4) {
                  setSelectedWords([...selectedWords, word]);
                }
              }}
            >
              <Typography fontFamily={"Libre Franklin"} fontWeight={700} fontSize={"16px"}>{word.toUpperCase()}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
      <Box display="flex" justifyContent="center" alignItems="center" gap={0.8} marginTop={"25px"} marginBottom={"25px"}>
          <Typography fontFamily={"Libre Franklin"} fontWeight={300} fontSize={"14px"} sx={{ userSelect: "none" }} >
            Mistakes Remaining:
          </Typography>
          <CircleIcon sx={{ fontSize: 15, color: "dimgray" }} />
          <CircleIcon sx={{ fontSize: 15, color: "dimgray" }} />
          <CircleIcon sx={{ fontSize: 15, color: "dimgray" }} />
          <CircleIcon sx={{ fontSize: 15, color: "dimgray" }} /> 
      </Box>
      {completedCategories.length < 4 && (
        <Box marginBottom={"25px"}>
        <Button
          disableRipple
          variant="outlined"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", marginRight: "10px", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none", border: "1px solid black" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
          onClick={() => {
            const shuffledWords = shuffleArray(allWords);
            setAllWords(shuffledWords);
          }}
        >
          Shuffle
        </Button>
        <Button
          disableRipple
          variant="outlined"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", marginRight: "10px", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none", border: "1px solid black" }, border: "1px solid black", boxShadow: "none", textTransform: "none", "&.Mui-disabled": { bgcolor: "white", color: "grey", border: "1px solid grey" } }}
          onClick={() => setSelectedWords([])}
          disabled={selectedWords.length === 0} // Disable if no words are selected
        >
          Deselect All
        </Button>
        <Button
          disableRipple
          variant="outlined"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", bgcolor: "black", color: "white", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "black", boxShadow: "none", border: "1px solid black" }, border: "1px solid black", boxShadow: "none", textTransform: "none", "&.Mui-disabled": { bgcolor: "white", color: "grey", border: "1px solid grey" }}}
          onClick={() => submitWordsMutation.mutate(selectedWords)}
          disabled={selectedWords.length !== 4 || submitWordsMutation.isPending} // Disable if not exactly 4 words are selected
        >
          {submitWordsMutation.isPending ? <CircularProgress size={20} sx={{color: "grey", marginRight: "15px", marginLeft: "15px"}} /> : 'Submit'}
        </Button>
      </Box>
      )}
      {completedCategories.length === 4 && (
        <Box marginBottom={"25px"}>
          <Button
            disableRipple
            variant="outlined"
            sx={{ fontFamily: "Libre Franklin", fontWeight: "600", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none", border: "1px solid black" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
            onClick={() => {
              // reload the page
              window.location.reload();
            }}
          >
            Regenerate
          </Button>
        </Box>
      
      )}
      <Divider></Divider>
      <Typography fontFamily={"Libre Franklin"} fontWeight={300} fontSize={"14px"} marginTop={"15px"} marginBottom={"15px"}>
        © 2025 Keenan Schott, Isaac Fry. All Rights Reserved. 
      </Typography>
    </Container>
  );
}

export default App;
