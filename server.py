from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

steps = [
	{
		"step": 1,
		"title": "Solve the White Face",
		"goalImage": "/static/imgs/firstLayerGoal.png",
		"goalDescription": "Notice that all edge pieces also have the same color",
		"description": "Choose a corner that has white, and bring the other 3 corner pieces to it.",
		"caseCaptionList": ["F D F'", "R' D' R", "R' D2 R D R' D' R"],
		"caseImgList": ["/static/imgs/Step1_1.png", "/static/imgs/Step1_2.png", "/static/imgs/Step1_3.png"],
		"caseTitleList": ["Case 1", "Case 2", "Case 3"]
	},
	{
		"step": 2,
		"title": "Orient the Blue Face",
		"goalImage": "/static/imgs/step2Goal.png",
		"goalDescription": "Notice that the white face is on the bottom.",
		"description": "Flip the cube and bring the blue sides to the opposite side of the white face",
		"caseCaptionList": ["Match the UP face to one of the pictures above", "Follow this algorithm", "If you do not have all BLUE tiles on the UP face, repeat Action 1 and 2. Repeat 2 or 3 times as needed."],
		"caseImgList": ["/static/imgs/step2_action1.png", "/static/imgs/step2_all_imgs.png", "/static/imgs/step2_action3.png"],
		"caseTitleList": ["Action 1", "Action 2", "Action 3"]
	},
	{
		"step": 3,
		"title": "Orient the Blue Face",
		"goalImage": "/static/imgs/step3Goal.png",
		"goalDescription": "Notice that all edge pieces also have the same color",
		"description": "Flip the cube and bring the blue sides to the opposite side of the white face",
		"caseCaptionList": ["Twist the top layer until the colored tiles of two corners match the bottom layer", "Orient the cube so it matches one of the pictures",
		"Follow this algorithm", "Repeat Actions 1-3 until solved"
		],
		"caseImgList": ["/static/imgs/Step3_1.png", "/static/imgs/Step3_2.png","/static/imgs/Step3_3.png", "/static/imgs/solved.png"],
		"caseTitleList": ["Action 1", "Action 2", "Action 3", "Action 4"]
	}
]

cubeOrientation = [[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],[6,6,6,6]]

@app.route('/')
def hello_world():
	cubeOrientation = [[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],[6,6,6,6]]
	return render_template('cube.html', cubeOrientation=cubeOrientation)

@app.route('/learn')
def learn():
	cubeOrientation = [[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],[6,6,6,6]]
	return render_template('learn.html', cubeOrientation=cubeOrientation)

@app.route('/learn/step/<int:stepNum>')
def loadStepPage(stepNum):
	if stepNum <= 3:
		return render_template('step.html', cubeOrientation=cubeOrientation, currStep=stepNum, currStepData = steps[stepNum - 1])

@app.route('/learn/step/updateCubeOrientation', methods=['GET','POST'])
def updateCubeOrientation():
	global cubeOrientation
	json_data = request.get_json()

	cubeOrientation = json_data
	return "true"

@app.route('/solve')
def loadSolvePage():
	cubeOrientation = [[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],[6,6,6,6]]
	return render_template('solve.html', cubeOrientation=cubeOrientation)


if __name__ == '__main__':
   app.run()




