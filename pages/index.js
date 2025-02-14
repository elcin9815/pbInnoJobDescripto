import Head from "next/head";
import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import CustomInput from "./CustomInput";

export default function Home() {
  const [jobNameInput, setJobNameInput] = useState("");
  const [jobLevelInput, setJobLevelInput] = useState("");
  const [experienceInput, setExperienceInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      // Send a request to keep the server awake
      fetch("/");
    }, 800000); // Send a request every 15 minutes (900,000 milliseconds)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobName: jobNameInput,
          jobLevel: jobLevelInput,
          experience: experienceInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div>
      <Head>
        <title>Job requirements</title>
        <link rel="icon" href="/biLogo.jpg" />
      </Head>

      <main className={styles.main}>
        <h3>Find job requirements</h3>
        <form onSubmit={onSubmit}>


          <CustomInput
              placeholder="Enter job name"
              value={jobNameInput}
              onChange={(value) => setJobNameInput(value)}

          />

          <input
            type="text"
            name="jobLevel"
            placeholder="Enter job level (ex. junior)"
            value={jobLevelInput}
            onChange={(e) => setJobLevelInput(e.target.value)}
          />
          <input
            type="text"
            name="experience"
            placeholder="Enter years of experience"
            value={experienceInput}
            onChange={(e) => setExperienceInput(e.target.value)}
              className={styles.customInput}

          />

          <div className={styles.buttonContainer}>
            <input type="submit" value="Create job description" disabled={isLoading} />
            {isLoading && <span className={styles.loadingMessage}>Loading...</span>}
          </div>
        </form>
        {result && (
          <div  className={styles.description} >
            <p>
              Job requirements and responsibilities of {jobLevelInput} {jobNameInput} with {experienceInput} year experience:
            </p>
          </div>
        )}
        {result && (
            <div className={styles.result}>
              <p dangerouslySetInnerHTML={{ __html: result.replace(/(About the Role)/g, '<strong>$1</strong>').replace(/(Responsibilities)/g, '<strong>$1</strong>').replace(/(Requirements)/g, '<strong>$1</strong>').replace(/\n/g, "<br>") }}></p>
            </div>
        )}
      </main>
    </div>
  );
}
