# College Scorecard Exploration and Visualization
An exploration and visualization of the data from the US Department of Education's College Scorecard dataset.

## Summary
Show how different financial aspects (i.e., cost, income after school, debt at graduation) of college have changed over the last 30 years. Compare schools to the national average and other schools.

## Initial Design Decisions (8-26-2016)
Show a time series of the cost, outcomes, and graduating debt of students using positional encoding. Each data point will be able to be hovered over to get the exact value at a point in time.

Users can select which financial aspect they would like to explore. The national average will be in dark gray and students can add up to five schools, encoded by color.

The legend will be either above the graphic or to the right, and the text color of the school corresponds to the color of the data in the time series.

## Feedback

### Jerry
* The scroll window to see the schools shouldn't go off the page or the page should move down to show all the options - NOT IMPLEMENTED - Using JQuery Autocomplete and don't know how to implement functionality. Because this isn't related to the showing of data in the visualization I'm going to leave it.
* "Add" on search schools is redundant - NOT IMPLEMENTED - Helps make the intention of the field more clear
* Try an "X" instead of "-" to remove school - NOT IMPLEMENTED - Minus in my opinion is more clear

### Will
* Be able to remove national average - IMPLEMENTED
* Have the feature dropdown widths be the same - IMPLEMENTED

### Bo

## Data Source
The dataset is available from <a href="https://www.kaggle.com">Kaggle</a>. For my project I used Version 1, specifically the dataset from 09-2015. https://www.kaggle.com/kaggle/college-scorecard
