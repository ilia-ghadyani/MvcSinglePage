using Microsoft.AspNetCore.Mvc;
using MvcSinglePage.ApplicationServices.Contracts;
using MvcSinglePage.ApplicationServices.Dtos.PersonDtos;

namespace MvcSinglePage.Controllers
{
    public class PersonController : Controller
    {
        private readonly IPersonApplicationService _personApplicationService;

        #region [- Ctor() -]
        public PersonController(IPersonApplicationService personApplicationService)
        {
            _personApplicationService = personApplicationService;
        }
        #endregion

        #region [- Index() -]
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        #endregion

        #region [- Create() -]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(PostPersonDto postPersonDto)
        {
            if (postPersonDto is null || !ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "The submitted information could not be processed."
                });
            }

            await _personApplicationService.Post(postPersonDto);

            return Json(new { message = "The person was successfully registered." });
        }
        #endregion

        #region [- Edit() -]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(PutPersonDto putPersonDto)
        {
            if (putPersonDto is null || !ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "The submitted information could not be processed."
                });
            }

            await _personApplicationService.Put(putPersonDto);

            return Json(new { message = "The person's information was successfully edited." });
        }
        #endregion

        #region [- Delete() -]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(DeletePersonDto deletePersonDto)
        {
            if (deletePersonDto is null || !ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "The submitted information could not be processed."
                });
            }
            await _personApplicationService.Delete(deletePersonDto);

            return Json(new { message = "The person was successfully deleted." });
        }
        #endregion

        #region [- GetAll() -]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _personApplicationService.GetAllPerson();
            return Json(result);
        }
        #endregion
    }
}
