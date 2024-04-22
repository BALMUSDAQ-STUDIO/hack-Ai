from langchain_core._api.deprecation import LangChainDeprecationWarning
from langchain_community.llms import LlamaCpp
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import warnings,json


def get_analise(answer):


    instruction = "[INST] analyze the answer {answer} and answer how much it matches the correct one [/INST]"


    # Load the LlamaCpp language model, adjust GPU usage based on your hardware
    llm = LlamaCpp(
        model_path="llm_chatbot/models/llama-2-7b-chat.Q4_K_M.gguf",
        n_gpu_layers=300,
        n_batch=1624,  # Batch size for model processing
        verbose=False,  # Enable detailed logging for debugging
        max_tokens=2000,
    )


    prompt = PromptTemplate(template=instruction, input_variables=["answer"])

    # Create an LLMChain to manage interactions with the prompt and model
    llm_chain = LLMChain(prompt=prompt, llm=llm)
    return {"ai_answer" : llm_chain.run(answer)}



def convert_to_json(qu_list):
    data = {
        "contest": [
            {
                "type": "ratio",
                "text": qu_list[0],
                "data": [
                    {"name": qu_list[1], "key": "1"},
                    {"name": qu_list[2], "key": "2"},
                    {"name": qu_list[3], "key": "3"}
                ]
            },
            {
                "type": "ratio",
                "text": qu_list[4],
                "data": [
                    {"name": qu_list[5], "key": "1"},
                    {"name": qu_list[6], "key": "2"},
                    {"name": qu_list[7], "key": "3"}
                ]
            },
            {
                "type": "ratio",
                "text": qu_list[8],
                "data": [
                    {"name": qu_list[9], "key": "1"},
                    {"name": qu_list[9], "key": "2"},
                    {"name": qu_list[9], "key": "3"}
                ]
            },
            {
                "type": "ratio",
                "text": qu_list[9],
                "data": [
                    {"name": qu_list[10], "key": "1"},
                    {"name": qu_list[11], "key": "2"},
                    {"name": qu_list[12], "key": "3"}
                ]
            },
            {
                "type": "input",
                "text": qu_list[13],
                "index": "1"
            },
            {
                "type": "input",
                "text": qu_list[14],
                "index": "1"
            },
            {
                "type": "input",
                "text": qu_list[15],
                "index": "1"
            },
            {
                "type": "input",
                "text": qu_list[16],
                "index": "1"
            },
            {
                "type": "input",
                "text": qu_list[17],
                "index": "1"
            },
            {
                "type": "input",
                "text": qu_list[18],
                "index": "1"
            }
        ]
    }
    return json.dumps(data, indent=4)


def get_test(file_path,session_id):
    warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)


    B_INST, E_INST = "[INST]", "[/INST]"
    B_SYS, E_SYS = "<<SYS>>\n", "\n<</SYS>>\n\n"


    def get_prompt(instruction, new_system_prompt ):
        SYSTEM_PROMPT = B_SYS + new_system_prompt + E_SYS
        prompt_template =  B_INST + SYSTEM_PROMPT + instruction + E_INST
        return prompt_template

    instruction = "Given the context that has been provided. \n {context}, create a test with answers "

    system_prompt = """You are a testing model that should produce tests based on a specific model.If the conditions for building the test are set, then follow them in the compilation of all questions. If the material does not make any sense or does not correspond to reality, give an error. After every question put the symbol "?".After every variant answer put the symbol "@".4 multiple choice questions, 3 thin questions, 3 thick questions"""

    get_prompt(instruction, system_prompt)

    template = get_prompt(instruction, system_prompt)




    # Load the LlamaCpp language model, adjust GPU usage based on your hardware
    llm = LlamaCpp(
        model_path="llm_chatbot/models/llama-2-7b-chat.Q4_K_M.gguf",
        n_gpu_layers=300,
        n_batch=1624,  # Batch size for model processing
        verbose=False,  # Enable detailed logging for debugging
        max_tokens=2000,
    )

    # Define the prompt template with a placeholder for the question


    prompt = PromptTemplate(template=template, input_variables=["context"])

    # Create an LLMChain to manage interactions with the prompt and model
    llm_chain = LLMChain(prompt=prompt, llm=llm)

    file=open(file_path,'r')
    file_text=file.read()

    qu_list=llm_chain.run(file_text).split('?')
    json_file=open(f"answer_{session_id}.json","w")
    json_object=convert_to_json(qu_list)
    json_file.write(json_object)
    file.close()
    return True

