import { useState } from "react";
import { Box, Button, Card, Typography, Container, Grid, Divider } from "@mui/material";
import "@fontsource/libre-franklin/900.css";
import "@fontsource/libre-franklin/200.css";
import "@fontsource/libre-franklin/300.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/600.css";
import "@fontsource/libre-franklin/700.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWords } from "./api.ts";

function App() {
  const [allWords, setAllWords] = useState<string[]>(["Apple", "Banana", "Cherry", "Date",
    "Elephant", "Falcon", "Giraffe", "Horse",
    "Test1", "Test2", "Test3", "Test4",
    "Test5", "Test6", "Test7", "Test8"]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  //const navigate = useNavigate();

  // Isaac, my sweet summer child, please turn your attention here
  // const { data: words = [] } = useQuery({ queryKey: ["words"], queryFn: fetchWords });

  // const submitWords = useMutation({
  //   mutationFn: async (selected: string[]) => {
  //     const response = await fetch("/api/submit", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ words: selected })
  //     });
  //     return response.json();
  //   }
  // });




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
          onClick={() => {
            setSelectedWords([]);
          }}
          disabled={selectedWords.length !== 4} // Disable if not exactly 4 words are selected
        >
          Submit
        </Button>
      </Box>
      <Divider></Divider>
      <Typography fontFamily={"Libre Franklin"} fontWeight={300} fontSize={"14px"} marginTop={"15px"} marginBottom={"15px"}>
        © 2025 Keenan Schott. All Rights Reserved. 
      </Typography>
    </Container>
  );
}

export default App;
