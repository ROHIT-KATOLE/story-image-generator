import easygui
from rembg import remove
from PIL import Image
# Load the images
inputPath = easygui.fileopenbox(title = 'Select image file')
outputPath = easygui.filesavebox(title = 'Save file to...')

input = Image.open(inputPath)
output = remove(input)
output.save(outputPath)
