import xml.etree.ElementTree as ET
import argparse

def get_list_elements(current_xml_tree, xpath_descriptor ,element_name):
    '''
    Simple function to look for children in the XML tree based off tag names
    Refer to https://docs.python.org/2/library/xml.etree.elementtree.html#supported-xpath-syntax for xpath_descriptor

    Parameters: 
        current_xml_tree (ElementTree): An ElementTree object that represents the current position of the XML tree
    
    Returns: 
        List[ElementTree]: Returns a filtered list of ElementTrees depending on the element name and xpath syntax 
    '''
    list_of_elements = current_xml_tree.findall(xpath_descriptor + element_name)
    return list_of_elements

def get_all_element_names(xml_tree):
    '''
    This function creates a dictionary of all the possible tag names in the xml file, and adds the namespace to each tag for easy access
    Eg. Look for the xmlns attribute in the first line of the xml file
    namespace = urn:ihe:qrph:sdc:2016
    Add curly brackets around the namespace, namespace = {urn:ihe:qrph:sdc:2016}
    Add actual tag name to the end the new namespace above
    Eg. {urn:ihe:qrph:sdc:2016}Body
    Set Body to be a key in a dictionary
    Eg. {"Body": "{urn:ihe:qrph:sdc:2016}Body"}

    Parameters: 
        xml_tree (ElementTree): An ElementTree object that represents the entire XML tree 
    
    Returns: 
        dict{str:str}: Returns a dictionary where the key represents the tag, and the value represents the namespace + tag 
    '''
    dict_elements = {}
    
    # Get namespace and put it in between curly brackets
    namespace = xml_tree.getroot().tag.split("}")[0]+"}"

    # Get all elements in XML
    for element in xml_tree.findall(".//"):
        # Get tag name
        # Note: element.tag would look like {some_namespace}TagName
        # So we split that string with the ending curly bracket to get the namespace and tag name
        tag = element.tag.split("}")[1]
        if tag in dict_elements:
            continue
        else:
            # Add to dictionary
            dict_elements[tag] = namespace + tag
    return dict_elements


def parse_xml(xml_tree):
    '''
    This is the main part of the parser. It first gets the body of the xml, 
    then gets the childitems tag, then retreives all the sections within the childiteam xml tree. 
    It will loop through each section, and parse the section accordingly, and adds it to the final sections list in parsed_xml

    Parameters: 
        xml_tree (ElementTree): An ElementTree object that represents the entire XML tree 

    Returns: 
        dict{str:List[]}: Returns the final dictionary of the parse XML tree
    '''
    body = get_list_elements(xml_tree, './/', ELEMENT_TAGS["Body"])
    child_items = get_list_elements(body[0],'', ELEMENT_TAGS["ChildItems"])
    sections = get_list_elements(child_items[0], '', ELEMENT_TAGS["Section"])
    parsed_xml = {"sections": []}
    for section in sections:
        parsed_xml["sections"] += parse_section(section)
    return parsed_xml

def parse_section(section):
    '''
    This function will parse the entire section, and creates a dictionary with its information accordingly.
    This will parse any question, or another section if there is a subsection.
    The subsection will go through recursion while the potential questions will be passed into another function

    Parameters: 
        section (ElementTree): An ElementTree object that represents a section in the XML file 
    
    Returns: 
        List[dict{str: obj}]: Returns a list with the details of the parsed section
    '''
    subsections = get_list_elements(section, './' + ELEMENT_TAGS['ChildItems'] + '/', ELEMENT_TAGS["Section"])
    questions = get_list_elements(section, './' + ELEMENT_TAGS['ChildItems'] + '/', ELEMENT_TAGS["Question"])
    subsection_list = []
    if len(subsections) > 0:
        for subsection in subsections:
            subsection_list += parse_section(subsection)
    question_list = parse_questions(questions, None, None, None)
    section_info = {"section_title": section.get("title"),
                    # "section_level": section.get("type"),
                    "section_id": section.get("ID"),
                    "subsections": subsection_list,
                    "questions": question_list}
    return [section_info]


def parse_questions(questions, parent_question, parent_answer, previous_question):
    '''
    This function will parse a list of questions. Each question will held within a dictionary,
    and that dictionary will be appened into a final list. Initially, parent_question, parent_answer. and previous_question
    will be None, but this will change if there is a specific multiple choice answer in the questionnaire that will lead
    to another question. The function will enter a recursive step if that's the case

    Parameters: 
        questions ([ElementTree]): A list of ElementTree objects where each object represents a Question in the XML Questionnaire
        parent_question (int): The id of the parent's question that leads to current question 
        parent_answer (int): The id of the parent's question's answer that leads to current question
        previous_question (str): The string of the parent's question's answer which will now represent as the current question
    
    Returns: 
        List[dict{str: obj}]: Returns a list with the details of the parsed questions
    '''
    questions_list = []
    for question in questions:
        question_text = question.get("title") if question.get("title") is not None else previous_question
        question_id = question.get("ID")

        # Check if question is reponse or list field
        response_answer = get_list_elements(question, '', ELEMENT_TAGS["ResponseField"])
        list_answer = get_list_elements(question, '', ELEMENT_TAGS["ListField"])
        question_type = "ListField" if len(response_answer) < len(list_answer) else "ResponseField"

        question_potential_answers = ""
        question_user_answer = ""

        if question_type == "ResponseField":
            question_potential_answers = ""
            question_user_answer = ""
        elif question_type == "ListField":
            list_tag = get_list_elements(question, './' + ELEMENT_TAGS['ListField'] + '/', ELEMENT_TAGS["List"])
            # Gets all potential answers for multiple choice questions
            list_items = get_list_elements(list_tag[0], '', ELEMENT_TAGS["ListItem"])
            question_potential_answers = []
            for list_item in list_items:
                answer_id = list_item.get("ID")
                answer_text = list_item.get("title")
                answer = {"answer": answer_text, "answer_id": answer_id}
                question_potential_answers.append(answer)
                # If there's a child in a "ListItem", this means the answer leads to another question
                if len(list_item) > 0:
                    subquestions = get_list_elements(list_item[0], '', ELEMENT_TAGS["Question"])
                    # Recurse to store the child question
                    questions_list += parse_questions(subquestions, question_id, answer_id, answer_text)
        question_details = {"question": question_text,
                            "question_id": question_id,
                            "question_type": question_type,
                            "potential_answers": question_potential_answers,
                            # "user_answer": question_user_answer,
                            # "parent_question": parent_question,
                            # "parent_answer": parent_answer  
                            }
        # Add question details to list
        questions_list.append(question_details)
    return questions_list



def main(): 
    '''
    This is the main function where the code initiates, and called parse_xml()
    '''
    
    # Get the command line argument for the file path
    parser = argparse.ArgumentParser()
    parser.add_argument('path', type=str)
    args = parser.parse_args()
    args = vars(args)

    try:
        xml_tree = ET.parse(args['path'])
    except FileNotFoundError:
        print({"success": False, "message": "Invalid file path"})
        return

    namespace = xml_tree.getroot().tag.split("}")[0]+"}"
    global ELEMENT_TAGS
    ELEMENT_TAGS = get_all_element_names(xml_tree)
    print(parse_xml(xml_tree))
      
      
if __name__ == "__main__": 
    # calling main function 
    main() 