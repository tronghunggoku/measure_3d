
import re

pca_content = """
<!-- Name=1_TOUR | Type=MESH -->
tx="988.65" ty="-432.45" tz="1047.02"
ox="988.65" oy="-432.45" oz="1047.02"
origin="-9.89, 4.32, -10.47"
align="0.0|175.7|0.0"
prealign="-0.0|-175.7|-0.0"

<!-- Name=2_TOUR | Type=MESH -->
tx="523.06" ty="-393.71" tz="835.48"
ox="523.06" oy="-393.71" oz="835.48"
origin="-5.23, 3.94, -8.35"
align="0.0|178.0|-0.5"
prealign="0.5|-178.0|-0.0"

<!-- Name=3_TOUR | Type=MESH -->
tx="23.27" ty="-373.7" tz="1055.69"
ox="23.27" oy="-373.7" oz="1055.69"
origin="-0.23, 3.74, -10.56"
align="-0.5|179.6|-0.5"
prealign="0.5|-179.6|0.5"

<!-- Name=4_TOUR | Type=MESH -->
tx="-322.74" ty="-389.02" tz="1073.67"
ox="-322.74" oy="-389.02" oz="1073.67"
origin="3.23, 3.89, -10.74"
align="0.0|178.8|0.0"
prealign="-0.0|-178.8|-0.0"

<!-- Name=5_TOUR | Type=MESH -->
tx="984.39" ty="-432.51" tz="89.17"
ox="984.39" oy="-432.51" oz="89.17"
origin="-9.84, 4.33, -0.89"
align="0.0|177.7|0.0"
prealign="-0.0|-177.7|-0.0"

<!-- Name=6_TOUR | Type=MESH -->
tx="477.92" ty="-386.46" tz="149.07"
ox="477.92" oy="-386.46" oz="149.07"
origin="-4.78, 3.86, -1.49"
align="0.0|174.8|0.0"
prealign="-0.0|-174.8|-0.0"

<!-- Name=7_TOUR | Type=MESH -->
tx="-12.64" ty="-393.66" tz="150.55"
ox="-12.64" oy="-393.66" oz="150.55"
origin="0.13, 3.94, -1.51"
align="0.0|177.4|0.0"
prealign="-0.0|-177.4|-0.0"

<!-- Name=8_TOUR | Type=MESH -->
tx="560.2" ty="-341.55" tz="-368.73"
ox="560.2" oy="-341.55" oz="-368.73"
origin="-5.6, 3.42, 3.69"
align="-0.5|176.94|0.0"
prealign="-0.0|-176.94|0.5"

<!-- Name=9_TOUR | Type=MESH -->
tx="-227.71" ty="-379.54" tz="-379.15"
ox="-227.71" oy="-379.54" oz="-379.15"
origin="2.28, 3.8, 3.79"
align="-0.06|177.4|-1.43"
prealign="1.43|-177.41|0.06"

<!-- Name=10_TOUR | Type=MESH -->
tx="-68.5" ty="-402.11" tz="-763.65"
ox="-68.5" oy="-402.11" oz="-763.65"
origin="0.69, 4.02, 7.64"
align="-1.0|175.83|0.0"
prealign="-0.0|-175.83|1.0"

<!-- Name=14_TOUR | Type=MESH -->
tx="988.65" ty="-432.45" tz="1047.02"
ox="988.65" oy="-432.45" oz="1047.02"
origin="-9.89, 4.32, -10.47"
align="0.0|175.7|0.0"
prealign="-0.0|-175.7|-0.0"

<!-- Name=15_TOUR | Type=MESH -->
tx="523.06" ty="-393.71" tz="835.48"
ox="523.06" oy="-393.71" oz="835.48"
origin="-5.23, 3.94, -8.35"
align="0.0|178.0|-0.5"
prealign="0.5|-178.0|-0.0"

<!-- Name=16_TOUR | Type=MESH -->
tx="23.27" ty="-373.7" tz="1055.69"
ox="23.27" oy="-373.7" oz="1055.69"
origin="-0.23, 3.74, -10.56"
align="-0.5|179.6|-0.5"
prealign="0.5|-179.6|0.5"

<!-- Name=17_TOUR | Type=MESH -->
tx="-322.74" ty="-389.02" tz="1073.67"
ox="-322.74" oy="-389.02" oz="1073.67"
origin="3.23, 3.89, -10.74"
align="0.0|178.8|0.0"
prealign="-0.0|-178.8|-0.0"

<!-- Name=18_TOUR | Type=MESH -->
tx="984.39" ty="-432.51" tz="89.17"
ox="984.39" oy="-432.51" oz="89.17"
origin="-9.84, 4.33, -0.89"
align="0.0|177.7|0.0"
prealign="-0.0|-177.7|-0.0"

<!-- Name=19_TOUR | Type=MESH -->
tx="477.92" ty="-386.46" tz="149.07"
ox="477.92" oy="-386.46" oz="149.07"
origin="-4.78, 3.86, -1.49"
align="0.0|174.8|0.0"
prealign="-0.0|-174.8|-0.0"

<!-- Name=20_TOUR | Type=MESH -->
tx="-12.64" ty="-393.66" tz="150.55"
ox="-12.64" oy="-393.66" oz="150.55"
origin="0.13, 3.94, -1.51"
align="0.0|177.4|0.0"
prealign="-0.0|-177.4|-0.0"

<!-- Name=21_TOUR | Type=MESH -->
tx="560.2" ty="-341.55" tz="-368.73"
ox="560.2" oy="-341.55" oz="-368.73"
origin="-5.6, 3.42, 3.69"
align="-0.5|176.94|0.0"
prealign="-0.0|-176.94|0.5"

<!-- Name=22_TOUR | Type=MESH -->
tx="-227.71" ty="-379.54" tz="-379.15"
ox="-227.71" oy="-379.54" oz="-379.15"
origin="2.28, 3.8, 3.79"
align="-0.06|177.4|-1.43"
prealign="1.43|-177.41|0.06"

<!-- Name=23_TOUR | Type=MESH -->
tx="-68.5" ty="-402.11" tz="-763.65"
ox="-68.5" oy="-402.11" oz="-763.65"
origin="0.69, 4.02, 7.64"
align="-1.0|175.83|0.0"
prealign="-0.0|-175.83|1.0"
"""

data_map = {}
sections = pca_content.strip().split("<!-- Name=")
for section in sections:
    if not section.strip(): continue
    lines = section.strip().split("\n")
    name_line = lines[0]
    id_match = re.search(r"(\d+)_TOUR", name_line)
    if id_match:
        scene_id = int(id_match.group(1))
        params = {}
        for line in lines[1:]:
            parts = re.findall(r"(\w+)=\"([^\"]+)\"", line)
            for k, v in parts:
                params[k] = v
        data_map[scene_id] = params

# Manually add missing scenes from tour_template.xml
data_map[11] = {"ox": "-118.42", "oy": "-363.18", "oz": "-83.31", "origin": "1.18, 3.63, 0.83", "align": "0.0|177.0|-1.0", "prealign": "1.0|-177.0|-0.0"}
data_map[12] = {"ox": "145.7", "oy": "-367.77", "oz": "-79.64", "origin": "-1.46, 3.68, 0.8", "align": "-0.0|180.0|-1.5", "prealign": "1.5|-180.0|0.0"}
data_map[13] = {"ox": "9.78", "oy": "-364.57", "oz": "271.43", "origin": "-0.1, 3.65, -2.71", "align": "0.0|178.7|0.0", "prealign": "-0.0|-178.7|-0.0"}

output = ""
for i in range(1, 24):
    if i in data_map:
        d = data_map[i]
        
        scene_xml = f"""
	<scene model="true" name="scene_{i}" onstart="showFlootHotspot();" thumburl="panos/{i}.tiles/thumb.jpg" title="{i}" type="panorama">
		
		<control bouncinglimits="calc:image.cube ? true : false" />

		<view hlookat="0.0" vlookat="0.0" fovtype="MFOV" fov="120" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto" />

		<preview url="panos/{i}.tiles/preview.jpg" />

		<image ox="{d["ox"]}" oy="{d["oy"]}" oz="{d["oz"]}" origin="{d["origin"]}" align="{d["align"]}" prealign="{d["prealign"]}" style="jypano_{i}">
			<cube url="panos/{i}.tiles/%s/l%l/%0v/l%l_%s_%0v_%0h.jpg" multires="512,640,1152,2304,4736" />
			<depthmap url="panos/{i}.tiles/model.stl" enabled="true" rendermode="3dmodel" background="none" scale="100" offset="0.0" subdiv="" hittest="true" />
		</image>

	</scene>
	<style linkedscene="scene_{i}" name="jypano_{i}" ox="{d["ox"]}" oy="{d["oy"]}" oz="{d["oz"]}" />
"""
        output += scene_xml

with open('scenes.xml', 'w') as f:
    f.write(output)
