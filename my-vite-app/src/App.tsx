import { useEffect, useState } from "react";
import { Box, Button, Card, Typography, Container, Grid, Divider } from "@mui/material";
import "@fontsource/libre-franklin/variable.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWords, submitWords } from "./api.ts";

type Category = {
  category: string;
  words: string[];
}

function App() {
  const [isInitialLoad] = useState(true);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [completedCategories, setCompletedCategories] = useState<Category[]>([]);
  const { data: backendWords = [] } = useQuery({ 
    queryKey: ["words"], 
    queryFn: fetchWords,
    enabled: isInitialLoad,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  });

  const colors = ["#f8df6b", "#a1c35b", "#b0c3ef", "#b981c5"];

  useEffect(() => {
    setAllWords(backendWords);
  }, [backendWords]);

  const submitWordsMutation = useMutation({
    mutationFn: submitWords,
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


  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; 
    }
    return newArray;
  };
    
  return (
    <Container style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
      <Typography variant="h4" gutterBottom fontFamily={"Libre Franklin"} fontWeight={900} onClick={() => console.log("add navigation at some point")} >
        Connections
      </Typography>
      <Typography marginBottom={"1rem"} variant="h2" gutterBottom fontSize={12} fontFamily={"Libre Franklin"} fontWeight={200}>
        but you're always right
      </Typography>
      <Divider></Divider>
      <Typography fontFamily={"Libre Franklin"} fontWeight={400} marginTop={"20px"} marginBottom={"20px"}>
        Create four groups of four!
      </Typography>
      <Container style={{ width: "60%" }}>
      <Grid container spacing={1} justifyContent="center">
        {completedCategories.map((category, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ borderRadius: "6px", boxShadow: "none", padding: 2.5, backgroundColor: colors[index], color: "black" }}>
              <Typography fontFamily={"Libre Franklin"} fontWeight={700} fontSize={"16px"}>{category.category.toUpperCase()}</Typography>
              <Typography fontFamily={"Libre Franklin"} fontWeight={500} fontSize={"16px"}>{category.words.map((word) => word.toUpperCase()).join(", ")}</Typography>
            </Card>
            
          </Grid>
        ))}
        {allWords.map((word, index) => (
          <Grid item xs={3} key={index}>
            <Card
              sx={{ borderRadius: "6px", boxShadow: "none", padding: 4, cursor: "pointer", backgroundColor: selectedWords.includes(word) ? "#59594e" : "#efeee6", color: selectedWords.includes(word) ? "white" : "black" }}
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
      <Box display="flex" justifyContent="center" alignItems="center" gap={0.4} marginTop={"0px"} marginBottom={"0px"}>
        <Typography fontFamily={"Libre Franklin"} fontWeight={300} fontSize={"14px"}>
          Mistakes Remaining:
        </Typography>
        <Typography fontSize={"40px"} color={"dimgray"}>
          ••••
        </Typography>
      </Box>
      {completedCategories.length < 4 && (
        <Box marginBottom={"25px"}>
        <Button
            variant="contained"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", marginRight: "10px", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
          onClick={() => {
            const shuffledWords = shuffleArray(allWords);
            setAllWords(shuffledWords);
          }}
        >
          Shuffle
        </Button>
        <Button
          variant="contained"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", marginRight: "10px", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
          onClick={() => setSelectedWords([])}
          disabled={selectedWords.length === 0} // Disable if no words are selected
        >
          Deselect All
        </Button>
        <Button
          variant="contained"
          sx={{ fontFamily: "Libre Franklin", fontWeight: "600", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
          onClick={() => submitWordsMutation.mutate(selectedWords)}
          disabled={selectedWords.length !== 4 || submitWordsMutation.isPending} // Disable if not exactly 4 words are selected
        >
          {submitWordsMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
      )}
      {completedCategories.length === 4 && (
        <Box marginBottom={"25px"}>
          <Button
            variant="contained"
            sx={{ fontFamily: "Libre Franklin", fontWeight: "600", bgcolor: "white", color: "black", borderRadius: "20px", cursor: "pointer", "&:hover": { bgcolor: "white", boxShadow: "none" }, border: "1px solid black", boxShadow: "none", textTransform: "none" }}
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
