//!!!
/////USE WITH STORE, HIGHLY EFFECTIVE
import logo from './logo.svg';
import './App.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const POSTS = [
  { id: 1, title: "POST1" },
  { id: 2, title: "POST2" },
]

function App() {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [jokes, setJokes] = useState([]);

  const jokesFetchAPI = async () => {
    const fetchingJokes = await (await fetch("http://universities.hipolabs.com/search?country=United+States&limit=10")).json();
    setJokes(fetchingJokes);
    console.log(fetchingJokes, "JOKES")

    return fetchingJokes;
  }

  const getPosts = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS])
  })

  const getJokes = useQuery({ queryKey: ["jokes"], queryFn: jokesFetchAPI })

  const newPostMutation = useMutation({
    mutationFn: title => wait(1000).then(() => { POSTS.push({ id: crypto.randomUUID(), title }) }),
    onSuccess: () => queryClient.invalidateQueries(["posts"])
  })

  const newJokesMutation = useMutation({
    mutationFn: title => wait(1000).then(() => { const replaceJokes = [...jokes, title]; setJokes(replaceJokes) }) //replace localstorage/cache/session
  })

  if (getPosts.isLoading) return <h1>...LOADING</h1>
  if (getPosts.error) return <h1>...ERROR {JSON.stringify(getPosts.error)}</h1>

  if (getJokes.isLoading) return <h1>...JOKES LOADING</h1>
  if (getJokes.error) return <h1>...ERROR {JSON.stringify(getJokes.error)}</h1>

  return (
    <div className="App">
      <button onClick={() => setShow(!show)}>SHOW JOKES</button>
      {!show && <>
        {getJokes.data.map((post) => <h1>{post.name}</h1>)}
        <button disabled={newJokesMutation.isLoading} onClick={() => newJokesMutation.mutate("NEW JOKE")}>NEW POST</button>
      </>}
    </div >
  );
}

function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default App;
