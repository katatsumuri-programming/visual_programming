import xmltodict
import json

xml = """
<xml>
    <variables>
        <variable id="QS7C:Lo8+7]o-LS1{N9M">abc</variable>
    </variables>
    <block type="procedures_defnoreturn" id="sCwMi%$hj[So?1d6qbu1" x="0" y="0">
        <field name="NAME">hello</field>
        <comment pinned="false" h="80" w="160">この関数の説明…</comment>
    </block>
    <block type="math_arithmetic" id="V1t,YP_]$!3Ey{bQbA*w" x="0" y="154">
        <field name="OP">MINUS</field>
        <value name="A">
            <shadow type="math_number" id="[}{wTB~k%JWuxwa-m2+J">
                <field name="NUM">1</field>
            </shadow>
        </value>
        <value name="B">
            <shadow type="math_number" id="?L?g!Ha8Xh~p:]yevY?U">
                <field name="NUM">1</field>
            </shadow>
        </value>
    </block>
    <block type="lists_setIndex" id="3y0b4$LI^-eIECqsnZT." x="0" y="244">
        <mutation at="true"></mutation>
        <field name="MODE">SET</field>
        <field name="WHERE">FROM_START</field>
        <value name="AT">
            <block type="math_number" id="jiP`|+qVW4{:91v)t?Oz">
                <field name="NUM">1</field>
            </block>
        </value>
        <value name="TO">
            <shadow type="text" id="az;{AXaVbip(;)Bj:(bf">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="variables_get" id="v7WXp!g~equ[~toZy;{B" x="64" y="296">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
    </block>
    <block type="lists_getIndex" id="S0hPcMp=7KWe:Wjv;_)K" x="0" y="350">
        <mutation statement="false" at="true"></mutation>
        <field name="MODE">GET</field>
        <field name="WHERE">FROM_START</field>
        <value name="VALUE">
            <block type="variables_get" id="3@gLL[NaT8(dX4NhwM.[">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
        <value name="AT">
            <block type="math_number" id="=@Z?xyWateV*}UJM_`3M">
                <field name="NUM">0</field>
            </block>
        </value>
    </block>
    <block type="lists_split" id="Ir-xOW|i~5OM}f@qiaa-" x="0" y="446">
        <mutation mode="SPLIT"></mutation>
        <field name="MODE">SPLIT</field>
        <value name="INPUT">
            <block type="variables_get" id="j~%pfopfYxI`{;P}12-9">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
        <value name="DELIM">
            <shadow type="text" id="gEe$8,:d.VjrC%.yBU4h">
                <field name="TEXT">,</field>
            </shadow>
        </value>
    </block>
    <block type="lists_split" id="i2i_cjKG14hz{*g2+D!F" x="0" y="544">
        <mutation mode="JOIN"></mutation>
        <field name="MODE">JOIN</field>
        <value name="INPUT">
            <block type="variables_get" id="V,SykVDDjQ%YD7nWwj-k">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
        <value name="DELIM">
            <shadow type="text" id="6FXI(pO~=+Zh$zZGsbpF">
                <field name="TEXT">,</field>
            </shadow>
        </value>
    </block>
    <block type="lists_indexOf" id="K(I5d-(=5S-M`3#}L{H." x="0" y="642">
        <field name="END">FIRST</field>
        <value name="VALUE">
            <block type="variables_get" id="3jWxGU!RYVC^l=GYOplI">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
        <value name="FIND">
            <shadow type="text" id="BJkF?rCRRF8/@lp3-%fU">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="lists_indexOf" id="A?OGq+hhMufS%FM^~f8E" x="0" y="740">
        <field name="END">LAST</field>
        <value name="VALUE">
            <block type="variables_get" id="Wr1^[?|!j7d,(su):(w$">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
        <value name="FIND">
            <shadow type="text" id="%H|-O#?ZbLXQJ=ZLp[qf">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="lists_length" id="q`9}0Y^o4M3$WH5*:x4=" x="0" y="838">
        <value name="VALUE">
            <block type="variables_get" id="wUS*7fT}1Z0:emN11,_3">
                <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
            </block>
        </value>
    </block>
    <block type="variables_get" id=".FkFe66XCu}6xZ#):XRu" x="266" y="859">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
    </block>
    <block type="text_indexOf" id="((]@Zw1PUf?Qg6Ciz_Ic" x="0" y="934">
        <field name="END">FIRST</field>
        <value name="VALUE">
            <shadow type="text" id="tDliS9xT^sI,F?INm82d">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
        <value name="FIND">
            <shadow type="text" id="tc+uE@}#}$Op3bQlWQ=W">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_indexOf" id="~,qxy_l?L7qMkRs7b7*7" x="0" y="1032">
        <field name="END">LAST</field>
        <value name="VALUE">
            <shadow type="text" id="FFnZ{yO*xFa0Q6scQMUd">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
        <value name="FIND">
            <shadow type="text" id="-gr4oQ6MHs)7yw{J%q*q">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_join" id="J[:%S!uAYQ!T_mVP_a.p" x="0" y="1130">
        <mutation items="2"></mutation>
        <value name="ADD0">
            <shadow type="text" id="0ktXhA7_^E6;O2I[9g:@">
                <field name="TEXT">abc</field>
            </shadow>
            <block type="math_number" id="ZFddmB_z{A^:J`SQ`}b4">
                <field name="NUM">0</field>
            </block>
        </value>
        <value name="ADD1">
            <shadow type="text" id="rpO#[5iMT(B/|1dt~28Z">
                <field name="TEXT">def</field>
            </shadow>
            <block type="math_number" id="EF}%2R6!~VUQ#/pL[@g#">
                <field name="NUM">0</field>
            </block>
        </value>
    </block>
    <block type="text_append" id="Ku+x,wK(oJh+k}GI_%sw" x="0" y="1278">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
        <value name="TEXT">
            <shadow type="text" id="2T,I|w1B/1}/xyqfP:5H">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_length" id="ODXRuh~dE0Yoq]GtBmBO" x="0" y="1392">
        <value name="VALUE">
            <shadow type="text" id="kd)4rJyc;E/c,cR:0g_(">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_charAt" id="Dmp.kxYyhHr/5DS{%tUk" x="0" y="1490">
        <mutation at="true"></mutation>
        <field name="WHERE">FROM_START</field>
        <value name="VALUE">
            <shadow type="text" id="1noR[aW8Lt/I(9`+$g}3">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
        <value name="AT">
            <block type="math_number" id="2pxe/]VJwUUvqYOG_yU8">
                <field name="NUM">2</field>
            </block>
        </value>
    </block>
    <block type="text_getSubstring" id="MR5v[{dy_f!C]ZT%I%_t" x="0" y="1588">
        <mutation at1="true" at2="true"></mutation>
        <field name="WHERE1">FROM_START</field>
        <field name="WHERE2">FROM_START</field>
        <value name="STRING">
            <shadow type="text" id="6tRi.@q~Ry_!YYv7%Zsq">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
        <value name="AT1">
            <block type="math_number" id="t4ag:-AU(XWGs{zmqXPP">
                <field name="NUM">2</field>
            </block>
        </value>
        <value name="AT2">
            <shadow type="math_number" id="MD2(D9/6mj$H,(8mkQ(M">
                <field name="NUM">3</field>
            </shadow>
        </value>
    </block>
    <block type="text_changeCase" id="[p;_@x}P|G@qIxes7E19" x="0" y="1686">
        <field name="CASE">UPPERCASE</field>
        <value name="TEXT">
            <shadow type="text" id="M2Md*Q,#wsM!O^8x:(Ta">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_changeCase" id="41m))bFo:wiyc0A$2zv!" x="0" y="1784">
        <field name="CASE">LOWERCASE</field>
        <value name="TEXT">
            <shadow type="text" id="Nk_I*lq=OzHd5EsXV?[V">
                <field name="TEXT">abc</field>
            </shadow>
        </value>
    </block>
    <block type="text_prompt_ext" id="85P*1ou~|Q[1Q?iwi.~u" x="0" y="1882">
        <mutation type="TEXT"></mutation>
        <field name="TYPE">TEXT</field>
        <value name="TEXT">
            <shadow type="text" id="0_om3K8[$@#d*HpjNPED">
                <field name="TEXT">abc?</field>
            </shadow>
        </value>
    </block>
    <block type="lists_create_empty" id="!(fxI4;^xD(a#(:%[+c^" x="0" y="1980"></block>
    <block type="lists_create_with" id="5tk:]?jOCT#C^YihDo8j" x="0" y="2068">
        <mutation items="3"></mutation>
        <value name="ADD0">
            <block type="text" id="HX-Kg9.T)_XRc6q81|7?">
                <field name="TEXT"></field>
            </block>
        </value>
        <value name="ADD1">
            <block type="text" id="c/J_dRv/6NA%iP+2Q=J3">
                <field name="TEXT"></field>
            </block>
        </value>
        <value name="ADD2">
            <block type="text" id="72nlbjxG.-vzww4KGK9Z">
                <field name="TEXT"></field>
            </block>
        </value>
    </block>
    <block type="variables_set" id="v1vE-S.0Q3gNGdZ%_wYA" x="0" y="2266">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
        <value name="VALUE">
            <block type="math_number" id="ASGZaQN3IE=){Hf.,Guw">
                <field name="NUM">0</field>
            </block>
        </value>
    </block>
    <block type="math_change" id="At%q~sj!m`mJnCQRb*qm" x="0" y="2372">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
        <value name="DELTA">
            <shadow type="math_number" id="/uQ5S0UuW-m)[5!=8`n4">
                <field name="NUM">1</field>
            </shadow>
        </value>
    </block>
    <block type="variables_get" id="9Ve,RdA}UKCtoCsojZ6W" x="0" y="2478">
        <field name="VAR" id="QS7C:Lo8+7]o-LS1{N9M">abc</field>
    </block>
</xml>
"""
dict_xml = xmltodict.parse(xml)
a = json.dumps(dict_xml, indent=2, ensure_ascii=False)
with open('file.txt', 'w') as f:
  print(a, file=f)