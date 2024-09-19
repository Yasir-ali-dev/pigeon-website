// Helper function to convert time string (e.g., "5:10:00") to seconds
const timeToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to calculate the last return time (latest) from all pigeon owners
const getLastReturnTime = (results) => {
  let latestTimeInSeconds = 0; // Store the latest time in seconds

  results.forEach((owner) => {
    const { pigeonsResults } = owner;

    // Extract return times for each pigeon
    const returnTimes = [
      pigeonsResults.firstPigeonReturnTime,
      pigeonsResults.secondPigeonReturnTime,
      pigeonsResults.thirdPigeonReturnTime,
      pigeonsResults.fourthPigeonReturnTime,
      pigeonsResults.fifthPigeonReturnTime,
      pigeonsResults.sixthPigeonReturnTime,
      pigeonsResults.seventhPigeonReturnTime,
    ];

    // Convert return times to seconds and filter out any undefined/null times
    const validReturnTimesInSeconds = returnTimes
      .filter((time) => time) // Remove any null/undefined times
      .map(timeToSeconds);

    // Find the latest return time for this owner
    const ownerLatestTime = Math.max(...validReturnTimesInSeconds);

    // Update the overall latest time if the owner's time is greater
    if (ownerLatestTime > latestTimeInSeconds) {
      latestTimeInSeconds = ownerLatestTime;
    }
  });

  // Convert the latest time back to hours, minutes, and seconds format
  const hours = Math.floor(latestTimeInSeconds / 3600);
  const minutes = Math.floor((latestTimeInSeconds % 3600) / 60);
  const seconds = latestTimeInSeconds % 60;

  // Return the formatted latest time (HH:MM:SS)
  return `${hours}:${minutes}:${seconds}`;
};

// Example usage with the results data
const results = [
  {
    name: "Owner 1",
    pigeonsResults: {
      firstPigeonReturnTime: "5:10:00",
      secondPigeonReturnTime: "5:20:00",
      thirdPigeonReturnTime: "5:30:00",
      fourthPigeonReturnTime: null,
      fifthPigeonReturnTime: null,
      sixthPigeonReturnTime: null,
      seventhPigeonReturnTime: null,
    },
  },
  {
    name: "Owner 2",
    pigeonsResults: {
      firstPigeonReturnTime: "6:15:00",
      secondPigeonReturnTime: "6:25:00",
      thirdPigeonReturnTime: "6:35:00",
      fourthPigeonReturnTime: "6:45:00",
      fifthPigeonReturnTime: null,
      sixthPigeonReturnTime: null,
      seventhPigeonReturnTime: null,
    },
  },
  // Add more owners here
];

function Test() {
  const lastReturnTime = getLastReturnTime(results);
  console.log("Last return time:", lastReturnTime);
}

export default Test;
