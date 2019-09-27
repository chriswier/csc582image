The NodeJS backend has a custom derived API for HTTP GET and POST requests.  The following API URLs describe the necessary HTTP methods, inputs, and return types.  The backend runs on port 3001, and all URLs will be prepended with the http://localhost:3001/ base URL.  Some URLs will have required inputs included as part of the URL; when applicable, variable names will be surrounded by brackets { } to indicate that the value should be filled in on URL request.

API URL:  http://localhost:3001/api/pics/{picturenumber}
HTTP Method:  GET
Return Type:  image/jpeg, a jpeg image with headers
Required Variables:  
  - picturenumber, an unsigned integer number of a picture found in the database.
      Required and provided as part of the URL.
      Example:  http://localhost:3001/api/pics/4537   - here picturenumber is 4537
Optional variables:
  - width, an unsigned integer value to resize the image width to.  Height is automatically computed via 
      the original aspect ratio.  Mutually exclusive with other optional variables.
      Example:  http://localhost:3001/api/pics/4537?width=1000
  - height, an unsigned integer value to resize the image height to.  Width is automatically computed via
      the original aspect ratio.  Mutually exclusive with other optional variables.
      Example:  http://localhost:3001/api/pics/4537?height=1000
  - resize, an unsigned integer percent value to resize the image to the given percent value.  Width and
      height are automatically computed at the original aspect ratio.  Mutually exclusive with other
      optional variables.
      Example:  http://localhost:3001/api/pics/4537?resize=200
  - greyscale, any value to greyscale colorize the image.  Mutually exclusive with other optional variables.
    Example:  http://localhost:3001/api/pics/4537?greyscale=true

API URL:  http://localhost:3001/api/search
HTTP Method: GET
Return Type: text/JSON 
Return: always return an empty JSON structure to the application; used in initialization, specifically:
  { success: true, data: { size: 0, maxSize: 0, offset: 0, images: [ ] }}

API URL:  http://localhost:3001/api/search
HTTP Method: POST
Required Variables:
  - body, a provided application/JSON string with the following keys:
    - searchsize, an unsigned integer for paginating how many results to return in one query
    - offset, an unsigned integer for giving the start index number for paginating results in one query
    - searchvalue, a string to search the captions database table
Return Type: text/JSON
Return: always return an JSON structure to the application filled in as requested.  The JSON will have two upper level keys, success – which will be true, and data, which will include specifically:
  - offset, an unsigned integer giving the current start index number for paginating results
  - size, an unsigned integer giving the current number of results being returned
  - maxSize, an unsigned integer giving the total number of results for the given searchvalue
  - images, an array of JSON entries for all matching images, further defined as:
      : id, an unsigned integer of the image identification number
      : width, an unsigned integer of the image width in pixels
      : height, an unsigned integer of the image height in pixels
      : file_name, a string with the original file name from the COCO dataset
      : license, a string with the license for the image
      : licenseUrl, a string with the license definition URL
      : flickerURL, a string with the original picture location via Flicker URL
      : cocoURL, a string with the COCO dataset picture location URL
      : data_captured, a string with the date the image was captured in ‘YYYY-MM-DD HH:MM:SS”
      : file_size, an unsigned integer with the size of the original image file in bytes
      : captions, an array of strings with the original captions from the captions database table

