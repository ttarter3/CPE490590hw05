# General 

Run with webserver with the command similar to the code below. Make sure to replace python.exe with your path to your python.
Also fix the path to hw5 question 2 python file q2.py

```
C:\Users\ttart\anaconda3\python.exe C:\Users\ttart\MyDriveUAH\CPE590_AI\hw\hw05\q2.py 
```

# Option 1:

Insert a valid file path to the photo you want to evalute in the "Upload Image" box.  Make sure it is supported by PIL.Image.open.  This has only been tested with the pictures in demo/*, specifically with pngs.  It was also tested with inverted images, so there is a check to see if the image needs to be inverted.  

# Option 2:

multiple images are stored in data and can be preloaded.  You can select these images with the option pane and then click "Use this image" to submit.  Note the number of preloaded images is set in the q2.py file

# Output
The image you selected post-processing will be displayed, as well as the selected value from the model.  Statics will show in the chart.js

